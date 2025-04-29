import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Col, Container, Accordion, Row, Button, Form, Figure } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { isEmpty } from "lodash";
import apiPath from "../utils/pathObj";
import { apiGet } from "../utils/apiFetch";
import ApplyJobs from "./components/ApplyJobs";
import AuthContext from "@/context/AuthContext";
import useToastContext from "@/hooks/useToastContext";
import users from "../images/user.png";
import Helpers from "@/utils/helpers";

function JobSeeker() {
  const router = useRouter();
  const notification = useToastContext();
  const { user } = useContext(AuthContext);
  const [jobsData, setJobsData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(1);
  const [categoryID, setCategoryID] = useState("");
  const [subCategoryID, setSubCategoryID] = useState("");
  const [countryID, setCountryID] = useState("");
  const [cityID, setCityID] = useState("");
  const [skillID, setSkillID] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [applyJobs, setApplyJobs] = useState(false);
  const [skillApply, setSkillApply] = useState({});
  const [activeItem, setActiveItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    category: "",
    searchKey: "",
    isReset: false,
    isFilter: false,
    categoryID: "",
    subCategoryID: "",
    cityID: "",
    countryID: "",
    skillID: [],
  });

  const jobList = async (allIds) => {
    try {
      let condi = {
        page: page || 1,
        keyword: searchTerm?.trim(),
        subCategoryID: (filterData?.subCategoryID === "all" ? "" : filterData?.subCategoryID) || allIds?.subCategoryID,
        categoryID: (filterData?.categoryID === "all" ? "" : filterData?.categoryID) || allIds?.categoryID,
        cityID: (filterData?.cityID === "all" ? "" : filterData?.cityID) || allIds?.cityID,
        countryID: (filterData?.countryID === "all" ? "" : filterData?.countryID) || allIds?.countryID,
        skillIds: (filterData?.skillID === "all" ? "" : filterData?.skillID.join(",")) || allIds?.skillID,
      };

      const path = apiPath.getJobs;
      const result = await apiGet(path, condi, false);
      const response = result?.data?.results;
      if (page > 1) {
        if (jobsData.length <= page * 10) setJobsData([...jobsData, ...response.docs]);
      } else setJobsData(response.docs);
      setPagination(response);
    } catch (error) {
      console.log("error in get all jobs list==>>>>", error.message);
    }
  };

  const subCategoryList = async () => {
    try {
      const path = apiPath.subCategoryListID;
      const result = await apiGet(path, { categoryID: categoryID }, false);
      const response = result?.data?.results;
      if (result?.data?.success) {
        setSubCategoryData(response);
      } else {
        setSubCategoryData([]);
      }
    } catch (error) {
      console.log("error in get all sub category list==>>>>", error.message);
    }
  };

  const categoryList = async () => {
    try {
      const path = apiPath.filterList;
      const result = await apiGet(path, {}, false);
      const response = result?.data?.results?.category;
      const responseCountry = result?.data?.results?.country;
      const responseSkills = result?.data?.results?.skills;
      setCategoryData(response);
      setCountryData(responseCountry);
      setSkillData(responseSkills);
    } catch (error) {
      console.log("error in get all category list==>>>>", error.message);
    }
  };

  const cityList = async () => {
    try {
      const path = apiPath.cityListID;
      const result = await apiGet(path, { countryID: countryID }, false);
      const response = result?.data?.results;
      if (result?.data?.success) {
        setCityData(response);
      } else {
        setCityData([]);
      }
    } catch (error) {
      console.log("error in get all sub city list==>>>>", error.message);
    }
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const handleReset = () => {
    setFilterData({
      category: "",

      isReset: true,
      isFilter: false,
      categoryID: "",
      subCategoryID: "",
      cityID: "",
      countryID: "",
      skillID: [],
    });

    setCountryID("");
    setCityID("");
    setSkillID([]);
    setSubCategoryID("");
    setActiveItem([]);
    setSubCategoryData([]);
    setCityData([]);
    setPage(1);
    setSearchTerm("");
    router.push(`/job-seeker`);
  };
  const changeCategory = (name, value, changeName, category) => {
    let obj = { ...router.query };
    obj[name] = category;
    if (name == "country") delete obj["city"];
    if (name == "category") delete obj["subCategory"];
    setFilterData({
      ...filterData,
      [changeName]: value,
    });
    router.push({
      pathname: "/job-seeker",
      query: obj,
    });
  };
  useEffect(() => {
    // Set search term from URL when component mounts or query changes
    if (router.query.search) {
      setSearchTerm(router.query.search);
    }
  }, [router.query.search]);

  useEffect(() => {
    const allKeysBlank = Object.values(filterData).every((value) => value === "");
    if (!allKeysBlank) {
      jobList();
    }
    categoryList();
  }, [filterData, page, searchTerm]); 


  useEffect(() => {
    const catId = Helpers.orCondition(categoryData.find((item) => item.slug == router?.query?.category)?._id, "");
    const subId = Helpers.orCondition(subCategoryData.find((item) => item.slug == router?.query?.subCategory)?._id, "");
    const countId = Helpers.orCondition(countryData.find((item) => item.slug == router?.query?.country)?._id, "");
    const cityId = Helpers.orCondition(cityData.find((item) => item.slug == router?.query?.city)?._id, "");

    const skillIds = skillData.filter((i) => router?.query?.skills?.split("&").includes(i.slug))?.map((i) => i?._id);

    let activeArr = [];
    if (router?.query?.country || filterData.countryID == "all") activeArr.push("0");
    if (router?.query?.city || filterData.cityID == "all") activeArr.push("1");
    if (router?.query?.category || filterData.categoryID == "all") activeArr.push("2");
    if (router?.query?.subCategory || filterData.subCategoryID == "all") activeArr.push("3");
    if (router?.query?.skills || filterData.skillID == "all") activeArr.push("4");
    if (!router?.query?.category && !router?.query?.subCategory && Object.keys(router?.query).length === 0) activeArr.push("0", "1", "2", "3", "4");
    setActiveItem(activeArr);
    
    const timeoutId = setTimeout(() => {
      setCategoryID(catId);
      setSubCategoryID(subId);
      setCountryID(countId);
      setCityID(cityId);
      setSkillID(skillIds || []);
      const obj = {};
      if (catId) obj.catId = catId;
      if (subId) obj.subId = subId;
      if (countId) obj.countId = countId;
      if (cityId) obj.cityId = cityId;
      if (skillIds?.length) obj.skillIds = skillIds;
      if (Object.keys(obj)?.length === Object.keys(router?.query || {})?.length) {
        if (categoryID) {
          jobList({
            categoryID: catId,
            cityID: cityId,
            countryID: countId,
            skillID: skillIds.join(","),
            subCategoryID: subId,
          });
        }
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [router?.query, categoryData, subCategoryData, countryData, cityData]);

  useEffect(() => {
    if (categoryID) {
      subCategoryList();
    }
  }, [categoryID]);

  useEffect(() => {
    if (countryID) {
      cityList();
    }
  }, [countryID]);

  const handleToggle = (eventKey) => {
    let activeArr = [...activeItem];
    if (activeArr.includes(eventKey)) {
      let i = activeArr.findIndex((item) => item === eventKey);
      activeArr.splice(i, 1);
    } else activeArr.push(eventKey);
    setActiveItem(activeArr);
  };

  useEffect(() => {
    document.getElementById("loader").style.display = "block";
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      document.getElementById("loader").style.display = "none";
    }, 1500);
  }, [router?.query]);

  return (
    <div>
      <section className="page_title_bar">
        <Container>
          <div className="page_title">
            <h2>Available Job for you</h2>
          </div>
        </Container>
      </section>

      <section className="job_listing_section page_main">
        <Container>
          <div className="job_list_wrap">
            <div className="filter_sidebar">
              <div className="sidebar_head d-flex align-items-center justify-content-between my-2">
                <h4 className="text-black mb-0">Filters</h4>
                <span className="text-orange fs-14 cursor-pointer" onClick={handleReset}>
                  Clear All
                </span>
              </div>

              <div className="filter_accordian">
                <Accordion defaultActiveKey={activeItem} activeKey={activeItem}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header onClick={() => handleToggle("0")}>Country</Accordion.Header>
                    <Accordion.Body>
                      <div className="select_list d-flex justify-content-between align-center">
                        <label for="country1">All</label>
                        <div className="radio_style_tab">
                          <input
                            type="radio"
                            name="Country"
                            id="country1"
                            checked={!countryData?.map((item) => item._id.toString()).includes(countryID?.toString())}
                            onClick={() => {
                              changeCategory("country", "all", "countryID", "");
                            }}
                            className="cursor-pointer"
                          />
                          <span className="radio_style"></span>
                        </div>
                      </div>
                      {countryData?.length > 0 &&
                        countryData?.map((item, index) => {
                          return (
                            <div className="select_list d-flex justify-content-between align-center" key={index} onClick={() => changeCategory("country", item._id, "countryID", item?.slug)}>
                              <label for="country1">{item?.name} </label>
                              <div className="radio_style_tab">
                                <input type="radio" name="Country" id="country1" checked={countryID?.toString() == item._id?.toString()} className="cursor-pointer" />
                                <span className="radio_style"></span>
                              </div>
                            </div>
                          );
                        })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header onClick={() => handleToggle("1")}>City</Accordion.Header>
                    <Accordion.Body>
                      <div className="select_list d-flex justify-content-between align-center">
                        <label for="City1">All</label>
                        <div className="radio_style_tab">
                          <input
                            type="radio"
                            name="City"
                            id="City1"
                            checked={!cityData?.map((item) => item._id.toString()).includes(cityID?.toString())}
                            onClick={() => {
                              changeCategory("city", "all", "cityID", "");
                            }}
                            className="cursor-pointer"
                          />
                          <span className="radio_style"></span>
                        </div>
                      </div>
                      {cityData?.length == 0 && (
                        <div className="select_list">
                          <label for="City1" className="pe-4">
                            No City Found
                          </label>
                        </div>
                      )}
                      {cityData?.length > 0 &&
                        cityData?.map((item, index) => {
                          return (
                            <div className="select_list d-flex justify-content-between align-center" key={index} onClick={() => changeCategory("city", item._id, "cityID", item?.slug)}>
                              <label for="City1">{item?.name}</label>
                              <div className="radio_style_tab">
                                <input type="radio" name="City" id="City1" checked={cityID?.toString() == item._id?.toString()} className="cursor-pointer" />
                                <span className="radio_style"></span>
                              </div>
                            </div>
                          );
                        })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header onClick={() => handleToggle("2")}>Category</Accordion.Header>
                    <Accordion.Body>
                      <div className="select_list d-flex justify-content-between align-center">
                        <label for="Category1">All</label>
                        <div className="radio_style_tab">
                          <input
                            type="radio"
                            name="Category"
                            id="Category1"
                            checked={!categoryData?.map((item) => item._id.toString()).includes(categoryID?.toString())}
                            onClick={() => {
                              changeCategory("category", "all", "categoryID", "");
                            }}
                            className="cursor-pointer"
                          />
                          <span className="radio_style"></span>
                        </div>
                      </div>
                      {categoryData?.length > 0 &&
                        categoryData?.map((item, index) => {
                          return (
                            <div className="select_list d-flex justify-content-between align-center" key={index} onClick={() => changeCategory("category", item._id, "categoryID", item?.slug)}>
                              <label for="Category1 ">{item?.name}</label>
                              <div className="radio_style_tab">
                                <input type="radio" name="Category" id="Category1" checked={categoryID?.toString() == item._id?.toString()} className="cursor-pointer" />
                                <span className="radio_style"></span>
                              </div>
                            </div>
                          );
                        })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header onClick={() => handleToggle("3")}>Sub Category</Accordion.Header>
                    <Accordion.Body>
                      <div className="select_list d-flex justify-content-between align-center">
                        <label for="sub_category1">All</label>
                        <div className="radio_style_tab">
                          <input
                            type="radio"
                            name="group1"
                            id="sub_category1"
                            checked={!subCategoryData?.map((item) => item._id.toString()).includes(subCategoryID?.toString())}
                            onClick={() => {
                              changeCategory("subCategory", "all", "subCategoryID", "");
                            }}
                            className="cursor-pointer"
                          />
                          <span className="radio_style"></span>
                        </div>
                      </div>
                      {subCategoryData?.length == 0 && (
                        <div className="select_list">
                          <label for="sub_category1" className="pe-4">
                            No Sub Category Found
                          </label>
                        </div>
                      )}
                      {subCategoryData?.length > 0 &&
                        subCategoryData?.map((item, index) => {
                          return (
                            <div className="select_list d-flex justify-content-between align-center" key={index} onClick={() => changeCategory("subCategory", item._id, "subCategoryID", item?.slug)}>
                              <label for="sub_category1">{item?.name}</label>
                              <div className="radio_style_tab">
                                <input type="radio" name="group1" id="sub_category1" checked={subCategoryID?.toString() == item._id?.toString()} className="cursor-pointer" />
                                <span className="radio_style"></span>
                              </div>
                            </div>
                          );
                        })}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4">
                    <Accordion.Header onClick={() => handleToggle("4")}>Skills</Accordion.Header>
                    <Accordion.Body className="select_list_skill">
                      <div className="select_list d-flex justify-content-between align-center">
                        <label for="skills1">All</label>
                        <div className="radio_style_tab">
                          <input
                            type="radio"
                            id="skills1"
                            checked={!skillData?.map((item) => item._id.toString()).includes(skillID?.toString())}
                            onClick={() => {
                              changeCategory("skills", "all", "skillID", "");
                            }}
                            className="cursor-pointer"
                          />
                          <span className="radio_style"></span>
                        </div>
                      </div>
                      {skillData?.length > 0 &&
                        skillData?.map((item, index) => {
                          return (
                            <div
                              className="select_list d-flex justify-content-between align-center"
                              key={index}
                              onClick={() => {
                                let Ids = [...skillID];
                                if (skillID.includes(item._id.toString())) {
                                  let i = skillID.findIndex((item1) => item1 == item._id.toString());
                                  Ids?.splice(i, 1);
                                } else {
                                  Ids.push(item._id.toString());
                                }
                                const skillSlug = skillData
                                  .filter((i) => Ids.includes(i._id.toString()))
                                  ?.map((i) => i?.slug)
                                  .join("&");

                                changeCategory("skills", Ids, "skillID", skillSlug);
                              }}
                            >
                              <label for="skills1" title={item?.name}>
                                {item?.name}{" "}
                              </label>
                              <div className="radio_style_tab">
                                <input type="radio" value={item._id?.toString()} checked={skillID.includes(item._id?.toString())} className="cursor-pointer" />
                                <span className="radio_style"></span>
                              </div>
                            </div>
                          );
                        })}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>

            <div className="job_list_right">
              <Button className="theme_md_blue_btn mb-2 d-block d-md-none py-2">Filter</Button>

              <Form className="job_search">
                <span className="search_icon">
                  <Image src="/images/search.svg" width={15} height={15} alt="" />
                </span>
                <Form.Control 
                  placeholder="Search by Job Title" 
                  className="job_search_form" 
                  aria-describedby="basic-addon1" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      jobList();
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    jobList();
                  }}
                  className="theme_lg_btn"
                >
                  Search
                </Button>
              </Form>
              {!loading && (
                <div className="job_listing_main">
                  <div className="search_result_count text-black mb-2">{pagination?.totalDocs || 0} Results Found </div>

                  {jobsData?.length > 0 &&
                    jobsData?.map((item, index) => {
                      return (
                        <div className="jobs_list" key={index}>
                          <div className="job_list_head d-flex justify-content-between align-items-center">
                            <div className="company_info_left d-flex align-items-center">
                              <Figure className="mb-0">
                                <Image src={item?.CompanyLogo || users} width={52} height={52} alt="" />
                              </Figure>

                              <figcaption>
                                <h3 className="text-md mb-1">
                                  <Link href="#" className="text-link text-black text-md">
                                    {item?.Company?.name}
                                  </Link>
                                </h3>
                                <p className="mb-0 white_space_wrap">
                                  <span className="me-1">
                                    <Image src="/images/location.png" width={20} height={20} alt="" />
                                  </span>
                                  {item?.Company?.address}
                                </p>
                              </figcaption>
                            </div>
                            <Button
                              className="outline_btn"
                              onClick={() => {
                                if (!isEmpty(user)) {
                                  setApplyJobs(true);
                                  setSkillApply({
                                    companyId: item?.Company?._id,
                                    _id: item._id,
                                    skills: item?.Skills.map((items) => {
                                      return {
                                        label: items.name,
                                        value: items._id,
                                      };
                                    }),
                                  });
                                } else {
                                  router.push("/signIn");
                                  notification.success("Please login to apply on job.");
                                }
                              }}
                            >
                              Apply on Job
                            </Button>
                          </div>
                          <div className="detail_body">
                            <Row>
                              <Col md="12">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/briefcase.png" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Job Title</span>
                                    <strong className="d-block text-md text-black fw-bold">{item?.name}</strong>
                                  </figcaption>
                                </div>
                              </Col>

                              <Col lg="4" sm="6">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/backwarditem.png" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Category</span>
                                    <strong className="d-block text-black fw-normal">{item?.Category?.name}</strong>
                                  </figcaption>
                                </div>
                              </Col>
                              <Col lg="4" sm="6">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/notepad.png" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Sub Category </span>
                                    <strong className="d-block text-black fw-normal">{item?.subCategory?.name}</strong>
                                  </figcaption>
                                </div>
                              </Col>
                              <Col lg="4" sm="6">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/buildings2.svg" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Department</span>
                                    <strong className="d-block text-black fw-normal">{item?.Department?.name}</strong>
                                  </figcaption>
                                </div>
                              </Col>
                              <Col lg="4" sm="6">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/buildings2.svg" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Job Location</span>
                                    <strong className="d-block text-black fw-normal">{item?.Country?.name + ", " + item?.City?.name}</strong>
                                  </figcaption>
                                </div>
                              </Col>
                              <Col lg="4" sm="6">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/additem.png" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Required Skills</span>
                                    <strong className="d-block text-black fw-normal">{item?.Skills?.map((skill) => skill?.name).join(", ")}</strong>
                                  </figcaption>
                                </div>
                              </Col>
                              <Col lg="4" sm="6">
                                <div className="detail_box">
                                  <figure>
                                    <Image src="/images/calendar.png" width={24} height={24} alt="" />
                                  </figure>
                                  <figcaption>
                                    <span className="text-gray">Employment Length</span>
                                    <strong className="d-block text-black fw-normal">{item?.employmentLength} days</strong>
                                  </figcaption>
                                </div>
                              </Col>
                            </Row>

                            <hr
                              style={{
                                margin: "0 -16px",
                                borderColor: "#EBEBEB",
                                opacity: "1",
                              }}
                            />

                            <div className="detail_box">
                              <figure>
                                <Image src="/images/notetext.png" width={24} height={24} alt="" />
                              </figure>
                              <figcaption className="job_description">
                                <ul>
                                  <span className="text-gray">Job Description</span>
                                  <ol className="text-dark">{item?.description}</ol>
                                </ul>
                              </figcaption>
                            </div>
                            <hr
                              style={{
                                margin: "0 -16px",
                                borderColor: "#EBEBEB",
                                opacity: "1",
                              }}
                            />
                            <div className="detail_box mb-0">
                              <figure>
                                <Image src="/images/directboxnotif.png" width={24} height={24} alt="" />
                              </figure>
                              <figcaption className="job_description">
                                <ul>
                                  <span className="text-gray">Termination Condition</span>
                                  <ol className="text-dark">{item?.terminationCondition}</ol>
                                </ul>
                              </figcaption>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {pagination?.hasNextPage && page <= pagination?.page && (
                    <div className="text-center pt-3 pt-md-5">
                      <button className="theme_lg_btn text-decoration-none subscription-btn" onClick={() => loadMore()}>
                        {" "}
                        Load more
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
        {applyJobs && <ApplyJobs open={applyJobs} skillApply={skillApply} setApplyJobs={setApplyJobs} onHide={() => setApplyJobs(false)} skillID={skillID} />}
      </section>
    </div>
  );
}

export default JobSeeker;
