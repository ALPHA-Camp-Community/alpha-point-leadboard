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
  const [loading, setLoading] = useState<boolean>(true)

  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  const twoDigitsMonth = month === 10 || month === 11 || month === 12 ? month : "0" + month

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}?date=${year}-${twoDigitsMonth}`)
        const data = res.data
        setPointData(data)
        setLoading(false)
      }
      catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [year, twoDigitsMonth])

  return (
    <>
      <header className="relative flex items-end justify-center bg-[#1E2129]  mb-10 h-[150px] bg-[url('https://i.imgur.com/UhtZAxq.png')] bg-white bg-no-repeat bg-center">
        <Image
          className="absolute top-[80%] border border-white rounded-md bg-white"
          src={"/AC_Logo.png"}
          alt="logo"
          width={50}
          height={50}
        />
      </header>
      <main className="flex flex-col items-center ">
        <div className="bg-[#1E2129] rounded-md w-4/5">
          <div className="m-5 flex flex-col h-20">
            <h1 className="text-lg">ALPHA Points Leaderboard</h1>
            <ul>
              <li>此 Leaderboard 記錄每人每月獲得的 ALPHA Points 數，數據會於每月 1 號更新（歸零重新計算）</li>
              <li>若想查詢自己的排名，請按「Ctrl/Command + F」，並輸入 Discord 暱稱即可找到對應的欄位</li>
            </ul>
          </div>
          <div className="mx-5">
            <hr className="mb-5" />
            <div className="flex justify-between mb-5">
              <p>User</p>
              <p>Point</p>
            </div>
            {loading && <p className="mb-5">Loading...</p>}
            {!loading && pointData.data.length !== 0
              ? pointData.data.map((u, index) => (
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
              ))
              : !loading && <div className="flex justify-between items-center mb-4">
                <p>這個月還沒有人得到 Point</p>
              </div>
            }
          </div>
        </div>
      </main>
    </>
  )
}
