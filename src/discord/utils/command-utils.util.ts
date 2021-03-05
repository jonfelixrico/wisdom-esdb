// <prefix> <other content>
const PREFIX_MATCHER_REGEXP = /^(\S+)\s+(.+?)\s*$/

export function matchPrefix(prefix: string, stringToMatch: string) {
  if (!PREFIX_MATCHER_REGEXP.test(stringToMatch)) {
    return false
  }

  const [foundPrefix, content] = PREFIX_MATCHER_REGEXP.exec(
    stringToMatch,
  ).slice(1)

  if (foundPrefix !== prefix) {
    return false
  }

  return content
}
