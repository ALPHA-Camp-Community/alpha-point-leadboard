import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, twoDigitsMonth, year } = req.query;
  try {
    const fetch = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}?date=${year}-${twoDigitsMonth}&page=${page}`
    );
    const { data } = fetch.data;
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
}
