import React, { useState, useEffect } from "react";
import { Breadcrumb, Container, Table } from "react-bootstrap";
// import Footer from 'components/Footer'
import { apiGet } from "@/utils/apiFetch";
import { GoBellFill } from "react-icons/go";

import dayjs from "dayjs";
import { isEmpty } from "lodash";
import pathObj from "@/utils/pathObj";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState();
  const [pageRecord] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const getNotifications = async (pageNumber = pageRecord.page) => {
    try {
      const params = {
        page: pageNumber || 1,
      };
      const res = await apiGet(pathObj.getNotifications, params);
      var response = res?.data?.results;
      setNotifications(response);
      if (page > 1) {
        if (notifications.length <= page * 10) setNotifications([...notifications, ...response?.docs]);
      } else setNotifications(response?.docs);
      setPagination(response);
    } catch (error) {
      console.log("error:", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [page]);

  const loadMore = () => {
    setPage(page + 1);
    getNotifications(page + 1);
  };

  return (
    <>
      <div className="main_wrap px-0 refer_earn">
        <Container>
          <Breadcrumb className="mb-3 notification-">
            <Breadcrumb.Item href="#" className="">
              <GoBellFill className="text-black fs-5" />
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              <strong className="text-black">Notification</strong>
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="bg-light main_panel rounded-0 p-3 p-md-4 myOrder">
            <div className="rounded-0 overflow-hidden bg-white  p-3 p-md-4">
              <Table responsive className="theme_lg_table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Created date</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications?.length > 0 &&
                    notifications?.map((item, index) => {
                      return (
                        <>
                          <tr>
                            <td>{item?.title}</td>
                            <td>{item?.description}</td>
                            <td> {dayjs(item?.createdAt).format("MM-DD-YYYY h:mm A")}</td>
                          </tr>
                        </>
                      );
                    })}
                  {isEmpty(notifications) ? (
                    <tr className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6 border-r" colSpan={4}>
                        No record found
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </div>
            {pagination?.hasNextPage && page <= pagination?.page && (
              <div className="text-center pt-3 pt-md-5">
                <button className="theme_lg_btn text-decoration-none subscription-btn" onClick={() => loadMore()}>
                  {" "}
                  Load more
                </button>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}

export default Notifications;
