# Http Errors

| status code | error name                    | description                                                                                                                                            |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 400         | badRequest                    | something is wrong with the request                                                                                                                    |
| 401         | unauthorized                  | the user is not authorized to access the resource                                                                                                      |
| 402         | paymentRequired               | the user needs to pay to access the resource                                                                                                           |
| 403         | forbidden                     | the user is not allowed to access the resource                                                                                                         |
| 404         | notFound                      | the resource was not found                                                                                                                             |
| 405         | methodNotAllowed              | the method is not allowed for this resource                                                                                                            |
| 406         | notAcceptable                 | the resource is not acceptable                                                                                                                         |
| 407         | proxyAuthenticationRequired   | the proxy authentication is required                                                                                                                   |
| 408         | requestTimeout                | the request timed out                                                                                                                                  |
| 409         | conflict                      | the request could not be completed due to a conflict                                                                                                   |
| 410         | gone                          | the resource is no longer available                                                                                                                    |
| 411         | lengthRequired                | the request did not specify the length of its content                                                                                                  |
| 412         | preconditionFailed            | the server does not meet one of the preconditions that the requester put on the request                                                                |
| 413         | payloadTooLarge               | the request is larger than the server is willing or able to process                                                                                    |
| 414         | uriTooLong                    | the URI provided was too long for the server to process                                                                                                |
| 415         | unsupportedMediaType          | the request entity has a media type which the server or resource does not support                                                                      |
| 416         | rangeNotSatisfiable           | the client has asked for a portion of the file, but the server cannot supply that portion                                                              |
| 417         | expectationFailed             | the server cannot meet the requirements of the Expect request-header field                                                                             |
| 418         | imATeapot                     | the server refuses the attempt to brew coffee with a teapot                                                                                            |
| 421         | misdirectedRequest            | the request was directed at a server that is not able to produce a response                                                                            |
| 422         | unprocessableEntity           | the request was well-formed but was unable to be followed due to semantic errors                                                                       |
| 423         | locked                        | the resource that is being accessed is locked                                                                                                          |
| 424         | failedDependency              | the request failed due to failure of a previous request                                                                                                |
| 425         | tooEarly                      | indicates that the server is unwilling to risk processing a request that might be replayed                                                             |
| 426         | upgradeRequired               | the client should switch to a different protocol such as TLS/1.0                                                                                       |
| 428         | preconditionRequired          | the origin server requires the request to be conditional                                                                                               |
| 429         | tooManyRequests               | the user has sent too many requests in a given amount of time                                                                                          |
| 431         | requestHeaderFieldsTooLarge   | the server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large         |
| 451         | unavailableForLegalReasons    | the server is denying access to the resource as a consequence of a legal demand                                                                        |
| 500         | internalServerError           | the server encountered an unexpected condition that prevented it from fulfilling the request                                                           |
| 501         | notImplemented                | the server does not support the functionality required to fulfill the request                                                                          |
| 502         | badGateway                    | the server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request |
| 503         | serviceUnavailable            | the server is currently unable to handle the request due to a temporary overload or scheduled maintenance                                              |
| 504         | gatewayTimeout                | the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI                        |
| 505         | httpVersionNotSupported       | the server does not support, or refuses to support, the major version of HTTP that was used in the request message                                     |
| 506         | variantAlsoNegotiates         | the server has an internal configuration error                                                                                                         |
| 507         | insufficientStorage           | the server is unable to store the representation needed to complete the request                                                                        |
| 508         | loopDetected                  | the server detected an infinite loop while processing the request                                                                                      |
| 510         | notExtended                   | further extensions to the request are required for the server to fulfill it                                                                            |
| 511         | networkAuthenticationRequired | the client needs to authenticate to gain network access                                                                                                |
