export function ChangeFontForAllHeadings(editor) {
  var fontface = "Georgia";
  // Both the data and the editing pipelines are affected by this conversion.
  editor.conversion.for("downcast").add(dispatcher => {
    // Use the "low" listener priority to apply the changes after the headings feature.
    dispatcher.on(
      "insert:heading1",
      (evt, data, conversionApi) => {
        const viewWriter = conversionApi.writer;
        viewWriter.setStyle(
          "font-family",
          fontface,
          conversionApi.mapper.toViewElement(data.item)
        );
      },
      { priority: "low" }
    );
    dispatcher.on(
      "insert:heading2",
      (evt, data, conversionApi) => {
        const viewWriter = conversionApi.writer;
        viewWriter.setStyle(
          "font-family",
          fontface,
          conversionApi.mapper.toViewElement(data.item)
        );
      },
      { priority: "low" }
    );
    dispatcher.on(
      "insert:heading3",
      (evt, data, conversionApi) => {
        const viewWriter = conversionApi.writer;
        viewWriter.setStyle(
          "font-family",
          fontface,
          conversionApi.mapper.toViewElement(data.item)
        );
      },
      { priority: "low" }
    );
  });
}
