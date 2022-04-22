import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(timezone)

export const GENERAL_PROJECT_CREATION_PERIOD_STARTS_AT = dayjs.tz(
  "2022-04-18T10:00:00",
  "Asia/Tokyo"
)
export const GENERAL_PROJECT_CREATION_PERIOD_ENDS_AT = dayjs.tz(
  "2022-04-20T23:59:59",
  "Asia/Tokyo"
)

// FIXME: ad-hoc
const isInProjectCreationPeriod = () => {
  if (
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev" /* ||
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging"*/
  ) {
    return true
  }

  return (
    dayjs().isSameOrAfter(GENERAL_PROJECT_CREATION_PERIOD_STARTS_AT) &&
    dayjs().isSameOrBefore(GENERAL_PROJECT_CREATION_PERIOD_ENDS_AT)
  )
}

// FIXME: ad-hoc
export const IN_PROJECT_CREATION_PERIOD = isInProjectCreationPeriod()
