import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

// TODO:
export const PROJECT_CREATE_STARTS_DATE = dayjs.tz(
  "2021-05-01T18:30:00",
  "Asia/Tokyo"
)
export const PROJECT_CREATE_ENDS_DATE = dayjs.tz(
  "2021-05-31T23:59:00",
  "Asia/Tokyo"
)
