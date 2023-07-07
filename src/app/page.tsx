'use client'

import Image from 'next/image'
import axios from 'axios'
import { useEffect, useState } from 'react'

type Data = {
  id: string
  name: string
  avatarURL: string
  period: string
  discordId: string
  point: number
}

type PointData = {
  data: Data[]
  offset: number
  pageSize: number
  totalPages: number
  currentPage: number
  totalDataCount: number
}

const pointDataInit = {
  data: [
    {
      id: '',
      name: '',
      avatarURL: '',
      period: '',
      discordId: '',
      point: 0,
    }
  ],
  offset: 0,
  pageSize: 0,
  totalPages: 0,
  currentPage: 0,
  totalDataCount: 0
}

export default function Home() {
  const [pointData, setPointData] = useState<PointData>(pointDataInit)

  const month = new Date().getMonth()
  const year = new Date().getFullYear()

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}?date=${year}-${month}`)
        const data = res.data
        setPointData(data)
      }
      catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [year, month])

  return (
    <>
      <header className="relative flex items-end justify-center bg-[#1E2129]  mb-10 h-[150px] bg-[url('https://i.imgur.com/UhtZAxq.png')] bg-white bg-no-repeat bg-center">
        <Image
          className="absolute top-[80%] border border-white rounded-md bg-white"
          src="/AC_Logo.png"
          alt="logo"
          width={50}
          height={50}
        />
      </header>
      <main className="flex flex-col items-center ">
        <div className="bg-[#1E2129] rounded-md w-4/5">
          <div className="mx-5 flex items-center h-20">
            <h1 className="text-lg">Leaderboard</h1>
          </div>
          <div className="mx-5">
            <hr className="mb-5" />
            <div className="flex justify-between mb-5">
              <p>User</p>
              <p>Point</p>
            </div>
            {pointData && pointData.data.map((u, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="flex gap-4 mt-5 items-center">
                  <Image
                    className="rounded-full bg-white"
                    src={u.avatarURL}
                    alt="logo"
                    width={50}
                    height={50}
                  />
                  <p>{u.name}</p>
                </div>
                <p>{u.point}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
