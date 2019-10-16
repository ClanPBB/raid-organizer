import {google} from 'googleapis'

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets'
]

export class GoogleAuth {
  constructor (
    clientSecret,
    clientId,
    redirectUris,
    refreshToken
  ) {
    this.clientSecret = clientSecret
    this.clientId = clientId
    this.redirectUris = redirectUris
    this.refreshToken = refreshToken

    this.oAuth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUris[0]
    )

    this.oAuth2Client.setCredentials({
      access_token: 'ya29.GltWBw0lhxCUQiU4A7cnLvKTlgQlOyKCbEzzwf3Gx3',
      refresh_token: '1/okbf8L_1On2l3BQ4XhZMNQ0YVsdwHCKHaxQqRMPz6THS18RrFtjjaiILHp6pXf8s',
      type: 'Bearer',
      scope: SCOPES,
      expires: 0
    })

    this.token = null
  }

  async generateRefreshToken () {
    // Generate a url that asks permissions for Gmail scopes
    
    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    
    console.log(`authUrl: ${url}`)

    // Result after visiting is like http://localhost:8000/?code=4/lgFsiS2xkz3Q5Z8nvKH16P4_ogn9bXZFIr8uOsjwJcJyk0B0KHmAQrGiPt60RD7xNBIeqfkiqD_MhggCZYWDnZM&scope=https://www.googleapis.com/auth/spreadsheets
  }

  async getTokens () {
    const code = '4/lgFsiS2xkz3Q5Z8nvKH16P4_ogn9bXZFIr8uOsjwJcJyk0B0KHmAQrGiPt60RD7xNBIeqfkiqD_MhggCZYWDnZM' // One time only, will provide refresh token
    const { tokens } = await this.oAuth2Client.getToken(code)
    console.log('tokens')
    console.log(tokens)
  }

  getAuthorizedClient () {
    return this.oAuth2Client
  }
}
