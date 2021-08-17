import { PageFC } from "next"
import { useState, useEffect } from "react"

import styles from "./meta.module.scss"
import { Head, Panel, Spinner } from "src/components"
import {
  healthCheck,
  checkLiveness,
  getBuildInfo,
  BuildInfo,
} from "src/lib/api/meta"

const Meta: PageFC = () => {
  const [healthCheckRes, setHealthCheckRes] = useState<Response | "error">()
  const [livenessRes, setLivenessRes] = useState<Response | "error">()
  const [buildInfo, setBuildInfo] = useState<BuildInfo | "error">()

  useEffect(() => {
    healthCheck()
      .then((res) => {
        setHealthCheckRes(res)
        console.log(res)
      })
      .catch((err) => {
        setHealthCheckRes("error")
        throw err
      })

    checkLiveness()
      .then((res) => {
        setLivenessRes(res)
        console.log(res)
      })
      .catch((err) => {
        setLivenessRes("error")
        throw err
      })

    getBuildInfo()
      .then((res) => {
        setBuildInfo(res)
        console.log(res)
      })
      .catch((err) => {
        setBuildInfo("error")
        throw err
      })
  }, [])

  return (
    <div className={styles.wrapper}>
      <Head title="開発者ツール" />
      <h1 className={styles.title}>開発者ツール</h1>
      {!healthCheckRes || !livenessRes || !buildInfo ? (
        <Panel>
          <div className={styles.emptyWrapper}>
            <Spinner />
          </div>
        </Panel>
      ) : (
        <>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>meta/health/check</h2>
              {healthCheckRes !== "error" && healthCheckRes.ok ? (
                <p className={styles.statusText}>
                  <i
                    className={`jam-icons jam-circle-f ${styles.statusIcon}`}
                  />
                  {`${healthCheckRes.status} ${healthCheckRes.statusText}`}
                </p>
              ) : (
                <p className={styles.statusText} data-error={true}>
                  <i className={`jam-icons jam-alert-f ${styles.statusIcon}`} />
                  {healthCheckRes === "error"
                    ? "Error"
                    : `${healthCheckRes.status} ${healthCheckRes.statusText}`}
                </p>
              )}
            </Panel>
          </div>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>meta/health/check-liveness</h2>
              {livenessRes !== "error" && livenessRes.ok ? (
                <p className={styles.statusText}>
                  <i
                    className={`jam-icons jam-circle-f ${styles.statusIcon}`}
                  />
                  {`${livenessRes.status} ${livenessRes.statusText}`}
                </p>
              ) : (
                <p className={styles.statusText} data-error={true}>
                  <i className={`jam-icons jam-alert-f ${styles.statusIcon}`} />
                  {livenessRes === "error"
                    ? "Error"
                    : `${livenessRes.status} ${livenessRes.statusText}`}
                </p>
              )}
            </Panel>
          </div>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>meta/get-build-info</h2>
              {buildInfo !== "error" ? (
                <>
                  <p className={styles.statusText}>
                    Version: {buildInfo.version}
                  </p>
                  <p className={styles.statusText}>
                    Profile: {buildInfo.profile}
                  </p>
                  {buildInfo.out && (
                    <p className={styles.statusText}>Out: {buildInfo.out}</p>
                  )}
                  <div className={styles.gitWrapper}>
                    <h3 className={styles.gitTitle}>git</h3>
                    <p className={styles.statusText}>
                      commit: {buildInfo.git.commit}
                    </p>
                    <p className={styles.statusText}>
                      branch: {buildInfo.git.branch}
                    </p>
                    <p className={styles.statusText}>
                      version: {buildInfo.git.version}
                    </p>
                  </div>
                </>
              ) : (
                <p className={styles.statusText} data-error={true}>
                  <i className={`jam-icons jam-alert-f ${styles.statusIcon}`} />
                  Error
                </p>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}
Meta.layout = "committee"
Meta.rbpac = { type: "public" }

export default Meta
