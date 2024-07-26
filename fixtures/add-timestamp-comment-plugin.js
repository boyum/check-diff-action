// @ts-check

/**
 * Adds a comment with the current timestamp to the end of the file
 * This makes the output different every time the file is built,
 * thus invalidating previous outputs. This again is used to check
 * that the GitHub Workflow diff checker works.
 */
export default () => ({
  name: "add-timestamp-comment-plugin",

  /**
   * @param {string} code
   */
  transform(code) {
    return code + `\nconsole.log(${Date.now()});`;
  },
});
