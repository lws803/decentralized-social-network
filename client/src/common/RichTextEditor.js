import React from "react";

import "./RichTextEditorStyle.scss";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail";

const initial = JSON.parse(sessionStorage.getItem("draftail:content"));

class RichTextEditor extends React.Component {
  render() {
    return (
      <DraftailEditor
        rawContentState={initial || null}
        onSave={this.props.onSave}
        blockTypes={[
          { type: BLOCK_TYPE.HEADER_ONE },
          { type: BLOCK_TYPE.HEADER_TWO },
          { type: BLOCK_TYPE.HEADER_THREE },
          { type: BLOCK_TYPE.UNSTYLED },
          { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
          { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
          { type: BLOCK_TYPE.BLOCKQUOTE },
          { type: BLOCK_TYPE.CODE },
        ]}
        inlineStyles={[
          { type: INLINE_STYLE.BOLD },
          { type: INLINE_STYLE.ITALIC },
          { type: INLINE_STYLE.CODE },
          { type: INLINE_STYLE.UNDERLINE },
          { type: INLINE_STYLE.STRIKETHROUGH },
          { type: INLINE_STYLE.QUOTATION },
          { type: INLINE_STYLE.KEYBOARD },
        ]}
      />
    );      
  }
}

export default RichTextEditor;
