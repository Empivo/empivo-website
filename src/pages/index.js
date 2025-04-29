import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import Slider from "react-slick";
import { Modal, Col, Container, Row, Button, Accordion, Form, Figure } from "react-bootstrap";
import Image from "next/image";
import apiPath from "@/utils/pathObj";
import { apiGet } from "@/utils/apiFetch";
import CategoryList from "./category/CategoryList";
import SubscriptionList from "./subscription/Subscription";
import { isEmpty } from "lodash";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import { GoArrowRight } from "react-icons/go";
import Helpers from "@/utils/helpers";

export default function Home() {
  const homebanner = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    nextArrow: (
      <div>
        <Image width={0} height={0} src="/images/right_arrow.png" alt="" />
      </div>
    ),
    prevArrow: (
      <div>
        <Image width={0} height={0} src="/images/left_arrow.png" alt="" />
      </div>
    ),
    responsive: [
      {
        breakpoint: 575,
        settings: {
          arrows: false,
          autoplay: true,
          autoplaySpeed: 2000,
        },
      },
    ],
  };
  const router = useRouter();
  const [banner, setBanner] = useState([]);
  const [taskNotification, setTaskNotification] = useState([]);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
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
  const [pageRecord] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })
  const { setSubscriptionID } = useContext(AuthContext)
  const [subscriptionList, setSubscriptionList] = useState([])
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
  const [searchJobTitle, setSearchJobTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");


  const handleClose = () => {
    setShow(false);
  };

  const getData = async () => {
    try {
      const { status, data } = await apiGet(apiPath.getBanner);
      if (status == 200) {
        if (data.success) {
          setBanner(data.results);
        }
      }
    } catch (error) { }
  };

  const employeeTaskNotification = async () => {
    try {
      const { status, data } = await apiGet(apiPath.employeeTaskNotification);
      if (status == 200) {
        if (data.success) {
          console.log("data.results?.isRead", data.results?.isRead);
          setOpen(data.results?.isRead);
          setTaskNotification(data.results);
        }
      }
    } catch (error) { }
  };

  useEffect(() => {
    getSubscriptionList()
  }, [filterData])

  const allPlansInclude = [
    {
      icon: '/images/planincimg1.png',
      title: 'Unlimited jobs and users'
    },
    {
      icon: '/images/planincimg2.png',
      title: 'Customizable hiring steps and templates'
    },
    {
      icon: '/images/planincimg3.png',
      title: 'Advanced search, tagging and team collaboration tools'
    },
    {
      icon: '/images/planincimg4.png',
      title: 'Hireology iOS and Android mobile app'
    },
    {
      icon: '/images/planincimg5.png',
      title: 'New customer onboarding'
    },
    {
      icon: '/images/planincimg6.png',
      title: 'Email and phone support'
    }
  ]

  const getSubscriptionList = async (pageNumber = pageRecord.page) => {
    try {
      let condi = {
        page: pageNumber || 1
      }
      var path = apiPath.getSubscriptionList
      const result = await apiGet(path, condi)
      var response = result?.data?.results
      setSubscriptionList([...subscriptionList, ...response.docs])
      setPagination(response)
    } catch (error) {
      console.log('error:', error)
    }
  }
  const findJobs = (e) => {
    e.preventDefault();

    const lowerCaseJobTitle = searchJobTitle.toLowerCase().replace(/\s+/g, '-');
    const lowerCaseLocation = searchLocation.toLowerCase();

    router.push({
      pathname: `/job-seeker`,
      query: {
        search: searchJobTitle,  // Add this line to pass the search term
        category: "",
        country: ""
      },
    });

  }


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
        // skillIds: filterData?.skillID.join(',') || allIds?.skillID
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


  useEffect(() => {
    const allKeysBlank = Object.values(filterData).every((value) => value === "");
    if (!allKeysBlank) {
      jobList();
    }
    categoryList();
  }, [filterData, page]);

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
  }, [router?.query?.slug, categoryData, subCategoryData, countryData, cityData]);

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


  useEffect(() => {
    document.getElementById("loader").style.display = "block";
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      document.getElementById("loader").style.display = "none";
    }, 1500);
  }, [router?.query]);


  useEffect(() => {
    getData();
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) employeeTaskNotification();
  }, []);

  return (
    <>
      <Head>
        <title>Comprehensive HR Solution! - Empivo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="/firebase-messaging-sw.js"></link>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;1000&display=swap" rel="stylesheet" ></link>
        <link type="module" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCyfi1GcGsUisGcHoaRNxTTq2VCoEXb1h8&libraries=geometry,drawing,places&callback=initMap&v=3.47"></link>
        <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>



      </Head>

      {/* banner-part */}

      <section className="banner-section">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-xm-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-xxl-5"
              style={{ padding: 0 }}
            >
              <div className="banner-left">
                <h1>FIND YOUR DREAM JOB</h1>
                <form className="searchform" onSubmit={findJobs}>
                  <Image width={0} height={0} src="/images/search-icon.png" alt="" />
                  <input
                    type="text"
                    placeholder="Job title, Keywords, Or Company"
                    value={searchJobTitle}
                    onChange={(e) => setSearchJobTitle(e.target.value)}
                  />
                  <div className="devider" />
                  {/* <Image width={0} height={0} src="/images/location-icon.png" alt="" />
                  <input
                    type="text"
                    placeholder="Country"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  /> */}
                  <button type="submit">Find jobs</button>
                </form>
              </div>
            </div>
            <div
              className="col-xm-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-xxl-7"
              style={{ padding: 0 }}
            >
              <div className="banner-right">
                {/* <Image  width={0} height={0} src="img/banner-img.png" class="img-fluid" alt=""> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="welcome-section">
        <div className="container">
          <div className="row">
            <div className="col-xm-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div className="welcome-left">
                <Image width={0} height={0}
                  src="/images/welcome-img.png"
                  className="img-fluid"
                  alt="welcome-image"
                />
              </div>
            </div>
            <div className="col-xm-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div className="welcome-right">
                <h2>
                  Welcome to <span>Empivo</span>{" "}
                </h2>
                <p>
                  Your Comprehensive HR Solution! Discover the power of Empivo - the
                  ultimate solution for transforming your HR operations with ease.
                  Dive into a world where every aspect of workforce management is
                  seamlessly integrated into one cohesive platform. From tracking
                  applicants to optimizing schedules, from managing tasks to keeping
                  precise time and attendance records, Empivo has thought of
                  everything. Experience the convenience of centralized workforce
                  management and unlock new levels of efficiency for your business.
                  With Empivo, you will never have to worry about scattered systems
                  or disjointed processes again. Join the Empivo family today and
                  elevate your HR game to new heights.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* welcome to employe section End here  */}
      {/* features job section start here  */}
      <div className="feature-job" id="categories">
        <div className="jobs-head">
          <h2>
            FEATURED <span>JOBS</span>
          </h2>
          <p>Know your worth and find the job that qualify your life</p>
        </div>

        <div className="container" >

          <div className="row">
            {jobsData?.length > 0 &&
              jobsData.map((item, index) => (
                <div className="col-12 col-md-6" key={index}>
                  <div className="jobs">
                    <div className="jobs-left">
                      <img src={item?.CompanyLogo || users} className="img-fluid" alt="code" />
                    </div>
                    <div className="jobs-right">
                      <div className="jobtitle">
                        <p>{item?.Company?.name}</p>
                        {/* <i className="fa-regular fa-font-awesome" /> */}
                      </div>
                      <div className="assts">
                        <img src="/images/business.png" alt="business" />
                        <span className="Segment">{item?.name}</span>

                        <img src="/images/location.png" alt="location" />
                        <span className="London">{item?.Company?.address}</span>

                        <img src="/images/calendar.png" alt="calender" />
                        <span className="hours">{item?.employmentLength} Opening</span>

                        <img src="/images/additem.png" alt="skill" />
                        <span className="dolar">{item?.Skills?.map((skill) => skill?.name).join(", ")}</span>
                      </div>
                      <p className="span-btn">
                        <a href="#">
                          <span className="fulltime">{item.jobType || "Full Time"}</span>
                        </a>
                        <a href="#">
                          <span className="private">{item.industry || "Private"}</span>
                        </a>
                        <a href="#">
                          <span className="urgent">{item.priority || "Urgent"}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>


      </div>
      {/* features job section End here  */}
      <div className="how-work">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xm-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4" style={{ padding: 0, background: "#F05A28" }}>
              <div className="work-left">
                <h2>How It <span>Works?</span></h2>
                <p>
                  Empivo revolutionizes HR management by offering a simple, yet
                  powerful approach to streamline your operations. Here's how it
                  works:
                </p>
              </div>
            </div>
            <div className="col-xm-12 col-sm-12 col-md-6 col-lg-8 col-xl-8 col-xxl-8 swiper-bg">
              <Slider
                dots={false}
                arrows={true}
                infinite={true}
                speed={500}
                slidesToShow={2}
                slidesToScroll={2}
                autoplay={true}
                autoplaySpeed={3000}
                responsive={[
                  {
                    breakpoint:700,  // Below 600px
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1
                    }
                  },
                ]}
              >
                {[
                  {
                    img: "/images/Vector-mind.png",
                    title: "Intuitive Interface",
                    text: "Empivo's user-friendly interface makes it easy for your team to navigate and utilize its features effectively. From HR managers to employees, everyone can quickly adapt to the platform, minimizing training time and maximizing productivity."
                  },
                  {
                    img: "/images/seamless.png",
                    title: "Seamless Integration",
                    text: "Upon joining Empivo, you'll gain access to a comprehensive platform where every aspect of HR is seamlessly integrated. No more jumping between multiple systems. Empivo consolidates all your HR processes into one intuitive interface."
                  },
                  {
                    img: "/images/Group.png",
                    title: "Customized Setup",
                    text: "Our team works closely with yours to tailor Empivo to your specific needs. Whether you're a small startup or a large enterprise, we ensure that the platform is configured to align with your unique workflows and objectives."
                  }
                ].map((item, index) => (
                  <div className="item" key={index}>
                    <div className="img">
                      <Image
                        width={100}
                        height={100}
                        src={item.img}
                        className="img-fluid"
                        alt={item.title}
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                    <div className="swipe">
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </Slider>
              <p className="exp-para">
                Experience the convenience of centralized workforce management
                with Empivo and unlock new levels of efficiency for your
                business. Join the Empivo family today and elevate your HR game
                to new heights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="subcribtion" id="subscription">
        <div className="sub-heading">
          <h2>
            SUBSCRIPTION&nbsp;<span>PLANS</span>
          </h2>
          <p>
            Empivo offers flexible subscription plans tailored to meet the diverse
            needs of businesses of all sizes. Whether you're a small startup, a
            growing mid-sized company, or a large enterprise, we have a plan that
            fits your requirements and budget. Choose the plan that best suits your
            organization's needs
          </p>
        </div>
        <div className="container">
          <div className="row">
            {subscriptionList.map((plan, i) => (
              <div
                className="col-xm-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                key={i}
              >
                <div className="sub-name-main">
                  <div className="sub-name-1">
                    <p>{plan.name.split(' ')[0]} <span>{plan.name.split(' ').slice(1).join(' ')}</span></p>
                  </div>
                </div>
                <div className="sub-price-main">
                  <div className="sub-price-1">
                    <p>
                      <span>${plan.amount}</span> Starting price /mo
                    </p>
                  </div>
                </div>

                <div className="subs_pkgbottom">
                  <div className="subs_featheadp">
                    <h5>Most popular {i > 0 ? 'features' : 'feature'}</h5>
                    {i > 0 && (
                      <span style={{ fontWeight: 400, fontSize: '14px' }}>
                        Everything in {i === 1 ? 'Essentials' : 'Professional'}, plus:
                      </span>
                    )}
                  </div>
                  <ul>
                    {plan.description.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="sub-detail">

                  <p>{plan.shortDescription || 'Everything your team needs to get started with our powerful feature suite'}</p>
                  <Link href="/user-form"><Button>Get Started</Button></Link>

                </div>
              </div>
            ))}
          </div>
          <div className="view-btn">
            <Link href="/subscription">
              <button>View All Subscription</button>
            </Link>
            <p>
              Choose the plan that aligns with your organization's size, goals, and
              budget, and unlock the full potential of Empivo's comprehensive HR
              solution. Upgrade or downgrade your plan at any time to adapt to your
              evolving needs. Empivo is committed to helping you succeed by
              providing flexible, scalable, and cost-effective subscription options.
            </p>
          </div>
        </div>
      </div>

      {/* Software Platform Section */}
      <div className="software">
        <div className="software-head">
          <h3>EMPIVO IS AN EFFORTLESS ONBOARDING</h3>
          <h2>SOFTWARE PLATFORM</h2>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xm-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-xxl-7 p-0">
              <div className="software-left">
                <Image width={0} height={0}
                  src="/images/laptop.png"
                  className="img-fluid"
                  alt="Laptop"
                />
              </div>
            </div>
            <div className="col-xm-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-xxl-5">
              <div className="software-right">
                <p>
                  Empivo is more than just a software platform; it's your partner in
                  transforming HR operations with unparalleled ease and efficiency.
                  Say goodbye to the days of juggling multiple systems and disjointed
                  processes. With Empivo, you'll experience a seamless integration of
                  every aspect of workforce management, all within one cohesive
                  platform.
                </p>
                <div className="nextpagebutton">
                  <Link href="/empivo-feature">Product feature page</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
