/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */

export async function getGeolocationPosition(
  timeout: number
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    function successCb(position: GeolocationPosition) {
      resolve(position)
    }
    function errorCb(error: GeolocationPositionError) {
      reject(error)
    }
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout,
      maximumAge: 0,
    }
    navigator.geolocation.getCurrentPosition(successCb, errorCb, options)
  })
}
