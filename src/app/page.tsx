'use client'

import Image from 'next/image'
import useSWR from 'swr'
import { useState } from 'react'

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

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export default function Home() {
  const { data, error, isLoading } = useSWR<
    PointData
  >(() => (`/api/getPointData`), fetcher)

  if (error) return <p>維護中...</p>
  if (!data) return null

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
          <div className="m-5 flex flex-col h-30">
            <h1 className="mb-2 text-2xl font-semibold">ALPHA Points Leaderboard</h1>
            <ul className="mb-5">
              <li className="mb-2">🎃此 Leaderboard 記錄每人每月獲得的 ALPHA Points 數，數據會於每月 1 號更新（歸零重新計算）</li>
              <li>🎃若想查詢自己的排名，請按「Ctrl/Command + F」，並輸入 Discord 暱稱即可找到對應的欄位</li>
            </ul>
            <hr />
            <div className="flex justify-between mt-5">
              <p>Rank</p>
              <p>User</p>
              <p>Points</p>
            </div>
          </div>
          <div className="mx-10">
            {isLoading && <p className="mb-5">Loading...</p>}
            {data.data.length !== 0
              ? data.data
                .sort((a, b) => { return b.point - a.point })
                .map((u, index) => (
                  <div key={index} className="flex justify-between items-center mb-4">
                    <p>{index + 1}</p>
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
              : <div className="flex justify-between items-center mb-4">
                <p>這個月還沒有人得到 Point</p>
              </div>
            }
          </div>
        </div>
      </main>
    </>
  )
}
