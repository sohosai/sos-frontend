import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(isSameOrAfter)
dayjs.extend(timezone)

export const PROJECT_CREATION_PERIOD_STARTS_AT = dayjs.tz(
  "2022-04-25T18:30:00",
  "Asia/Tokyo"
)
export const PROJECT_CREATION_PERIOD_ENDS_AT = dayjs.tz(
  "2022-05-14T00:00:00",
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
    dayjs().isSameOrAfter(PROJECT_CREATION_PERIOD_STARTS_AT) &&
    dayjs().isBefore(PROJECT_CREATION_PERIOD_ENDS_AT)
  )
}

// FIXME: ad-hoc
export const IN_PROJECT_CREATION_PERIOD = isInProjectCreationPeriod()
