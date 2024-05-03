import { useEffect, useState } from 'react'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import Chart from 'chart.js/auto'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { getRelativePosition } from 'chart.js/helpers'
import dataAnalytisService from '@/services/api/admin/dataAnalytisService'
import { useLoading } from '@/contexts/loading'

const Dashboard = () => {

  const { setSidebarActive } = useSidebarActive()
  const [datataRevenueYearly, setDataRevenueYearly] = useState([])
  const [datataRevenueMonthly, setDataRevenueMonthly] = useState([])
  const [dataMotoType, setDataMotoType] = useState([])
  const { showLoading, hideLoading } = useLoading()
  const [yearSelect, setYearSelect] = useState(2024)

  const listYears = [2021, 2022, 2023, 2024]

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.DASHBOARD)
    fetchDatataRevenueYearly()
    fetchDatataRevenueMonthly()
    fetchDataMotoType()
  }, [])

  const fetchDatataRevenueYearly = params => {
    showLoading()
    dataAnalytisService
      .yearly(params)
      .then(data => {
        setDataRevenueYearly(data)
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const handleChangYear = e => {
    fetchDatataRevenueMonthly(e.target.value)
    setYearSelect(e.target.value)
  }

  const fetchDatataRevenueMonthly = year => {
    showLoading()
    dataAnalytisService
      .monthly({ year: year ?? 2024 })
      .then(data => {
        setDataRevenueMonthly(data)
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const fetchDataMotoType = () => {
    showLoading()
    dataAnalytisService
      .statusMoto()
      .then(data => {
        setDataMotoType(data)
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const dataYearly = {
    labels: datataRevenueYearly.map(item => item.year),
    datasets: [
      {
        label: 'Revenue',
        data: datataRevenueYearly.map(item => item.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const dataMonthly = {
    labels: datataRevenueMonthly.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: datataRevenueMonthly.map(item => item.revenue),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      // {
      //   label: 'Number order',
      //   data: datataRevenueMonthly.map(item => item.orderNumber),
      //   borderColor: 'rgb(255, 99, 132)',
      //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
      //   borderWidth: 1,
      //   yAxisID: 'y1',
      // },
    ],
  }

  const dataMotoTypePie = {
    labels: dataMotoType.map(item=>item.status),
    datasets: [
      {
        label: '# of Votes',
        data: dataMotoType.map(item=>item.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsMonthly = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart revenue monthly',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const optionsYearly = {
    plugins: {
      title: {
        display: true,
        text: 'Chart revenue yearly',
      },
    },
  }

  return (
    <div>
      <h1 className="text-3xl">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <div className="bg-white p-3 col-span-2">
          <Bar data={dataYearly} options={optionsYearly} />
        </div>
        <div className="bg-white p-3 col-span-2">
          <select onChange={e => handleChangYear(e)}>
            {listYears.map((year, index) => (
              <option selected={year === yearSelect} key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Line data={dataMonthly} options={optionsMonthly} />
        </div>

        <div className="bg-white p-3 col-span-2">
          <Pie data={dataMotoTypePie} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
