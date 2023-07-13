import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  const twoDigitsMonth = month === 10 || month === 11 || month === 12 ? month : "0" + month
  try {
    const fetch = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}?date=${year}-${twoDigitsMonth}`)
    const data = fetch.data
    return res.status(200).json(data)
  }
  catch (e) {
    console.log(e)
  }
}