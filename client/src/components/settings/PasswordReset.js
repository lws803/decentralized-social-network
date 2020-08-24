import React, { useState } from "react";
import PropTypes from "prop-types";

import SEA from "gun/sea";
import Gun from "gun/gun";
import Validator from "jsonschema";
import { Button, Header } from "semantic-ui-react";
import styled from "styled-components";

import { PasswordSchema } from "../common/Schemas";
import { Errors, Info } from "../common/Messages";
import { ValidationError } from "../../common/Exceptions";

async function resetPassword(newPass, retypeNewPass, user, gunSession) {
  try {
    const v = new Validator.Validator();
    const newPassResult = v.validate(newPass, PasswordSchema, {
      propertyName: "New password",
    });
    if (newPassResult.errors.length) {
      throw new ValidationError(newPassResult.errors.join("\n"));
    }
    if (!user.is) {
      throw new ValidationError(Errors.user_not_logged_in);
    }
    if (retypeNewPass !== newPass) {
      throw new ValidationError(Errors.password_not_match);
    }
    const { pub, priv, epriv } = user._.sea;
    const id = `~${pub}`;
    const key = "auth";
    const salt = Gun.text.random(64);
    const proof = await new Promise(res => SEA.work(newPass, salt, res));
    const encrypted = await new Promise(res =>
      SEA.encrypt({ priv, epriv }, proof, res, {
        raw: 1,
      })
    );
    const value = JSON.stringify({ ek: encrypted, s: salt });
    let res = await gunSession.get(id).get(key).put(value);
    return res;
  } catch (err) {
    throw err;
  }
}

export default function PasswordReset(props) {
  const [newPass, setNewPass] = useState("");
  const [retypeNewPass, setRetypeNewPass] = useState("");

  return (
    <ResetPasswordContainer>
      <Header as="h5">New password</Header>
      <PasswordInput
        type="password"
        value={newPass}
        onChange={event => setNewPass(event.target.value)}
      />
      <Header as="h5">Retype password</Header>
      <PasswordInput
        type="password"
        value={retypeNewPass}
        onChange={event => setRetypeNewPass(event.target.value)}
      />
      <ButtonContainer>
        <Button
          content="Reset"
          primary
          size="small"
          onClick={() =>
            resetPassword(newPass, retypeNewPass, props.user, props.gun)
              .then(ack => {
                alert(Info.password_changed);
                setNewPass("");
                setRetypeNewPass("");
              })
              .catch(err => {
                alert(err);
              })
          }
        />
      </ButtonContainer>
    </ResetPasswordContainer>
  );
}

PasswordReset.propTypes = {
  user: PropTypes.object.isRequired,
};

const ResetPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  margin-right: auto;
  margin-top: 10px;
`;

const PasswordInput = styled.input`
  width: 30%;
  min-width: 200px;
`;
