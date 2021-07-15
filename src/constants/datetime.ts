import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

export const GENERAL_PROJECT_CREATION_PERIOD_STARTS_AT = dayjs.tz(
  "2021-07-16T18:30:00",
  "Asia/Tokyo"
)
export const GENERAL_PROJECT_CREATION_PERIOD_ENDS_AT = dayjs.tz(
  "2021-07-30T23:59:00",
  "Asia/Tokyo"
)

// FIXME: ad-hoc
const isInProjectCreationPeriod = () => {
  if (
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev" ||
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging"
  ) {
    return true
  }

  return (
    dayjs().isAfter(GENERAL_PROJECT_CREATION_PERIOD_STARTS_AT) &&
    dayjs().isBefore(GENERAL_PROJECT_CREATION_PERIOD_ENDS_AT)
  )
}

// FIXME: ad-hoc
export const IN_PROJECT_CREATION_PERIOD = isInProjectCreationPeriod()
