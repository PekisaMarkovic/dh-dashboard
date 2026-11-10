// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateCompleteness = (object: any, keysToSkip: string[] = []): number => {
  const allKeys = Object.keys(object)
  const keys = allKeys.filter((key) => !keysToSkip.includes(key))
  const totalFields = keys.length
  let completedFields = 0

  keys.forEach((key) => {
    const value = object[key]

    if (Array.isArray(value)) {
      if (value.length > 0) {
        completedFields++
      }
    } else if (value !== null && value !== undefined && value !== '') {
      completedFields++
    }
  })

  const completionPercentage = (completedFields / totalFields) * 100

  return parseInt(`${completionPercentage}`)
}

export const calculateArrayCompleteness = (lenght: number): number => {
  if (lenght >= 2) {
    return 100
  } else if (lenght === 1) {
    return 50
  } else {
    return 0
  }
}
