"use client";

import Image from "next/image";
import useSWR from "swr";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

type Data = {
  id: string;
  name: string;
  avatarURL: string;
  period: string;
  discordId: string;
  point: number;
};

type PointData = {
  data: Data[];
  offset: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  totalDataCount: number;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export default function Home() {
  const { data, error, isLoading } = useSWR<PointData>(
    () => `/api/getPointData`,
    fetcher
  );

  if (error) return <p>維護中...</p>;
  if (!data) return null;

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
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box className="bg-[#1E2129] rounded-md w-4/5">
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            margin={"10px"}
          >
            <h1 className="mb-2 text-2xl font-semibold">
              ALPHA Points Leaderboard
            </h1>
            <ul className="mb-5">
              <li className="mb-2">
                🎃此 Leaderboard 記錄每人每月獲得的 ALPHA Points
                數，數據會於每月 1 號更新（歸零重新計算）
              </li>
              <li>
                🎃若想查詢自己的排名，請按「Ctrl/Command + F」，並輸入 Discord
                暱稱即可找到對應的欄位
              </li>
            </ul>
            <hr />
          </Box>
          <TableContainer
            display={"flex"}
            justifyContent={"center"}
            marginTop={"10px"}
          >
            <Table className="rounded-md w-4/5">
              <Thead className="text-left">
                <Tr>
                  <Th className="text-center">Rank</Th>
                  <Th>User</Th>
                  <Th className="text-center">🧡 Points</Th>
                </Tr>
              </Thead>
              <Tbody className="text-left">
                {isLoading && <p className="mb-5">Loading...</p>}
                {data.data.length !== 0 ? (
                  data.data
                    .sort((a, b) => {
                      return b.point - a.point;
                    })
                    .map((u, index) => (
                      <Tr key={index}>
                        <Td className="text-center">{index + 1}</Td>
                        <Td className="flex gap-4 mt-5 items-center">
                          <Image
                            className="rounded-full bg-white"
                            src={u.avatarURL}
                            alt="logo"
                            width={50}
                            height={50}
                          />
                          {u.name}
                        </Td>
                        <Td className="text-center">{u.point}</Td>
                      </Tr>
                    ))
                ) : (
                  <Box className="flex justify-between items-center mb-4">
                    <p>這個月還沒有人得到 Point</p>
                  </Box>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
