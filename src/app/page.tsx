"use client";

import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Spinner,
} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const PAGE_SIZE = 10;

export default function Home() {
  const { data, size, setSize, isLoading, error } = useSWRInfinite(
    (index) => `/api/getPointData?page=${index + 1}`,
    fetcher
  );

  const isEmpty = data?.[0]?.length === 0;
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  if (error) return <Text>維護中...</Text>;
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
          <InfiniteScroll
            next={() => !isReachingEnd && setSize(size + 1)}
            hasMore={true}
            loader={
              <Box display={"inline-flex"} marginY={16}>
                {isLoadingMore ? (
                  <>
                    <Spinner
                      size={"lg"}
                      width={24}
                      height={24}
                      marginRight={10}
                    />
                    <Text>Loading...</Text>
                  </>
                ) : isReachingEnd ? (
                  <Text>沒有更多資料</Text>
                ) : null}
              </Box>
            }
            dataLength={data.length}
            className="text-center"
          >
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
                  {data.length !== 0 ? (
                    data
                      .flat()
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
          </InfiniteScroll>
        </Box>
      </Box>
    </>
  );
}
