import { useEffect, useState } from 'react'
import { useSidebarActive } from '@/contexts/sidebarActive'
import { ROUTES_ADMIN } from '@/config/routes'
import Chart from 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import { getRelativePosition } from 'chart.js/helpers'
import dataAnalytisService from '@/services/api/admin/dataAnalytisService'
import { useLoading } from '@/contexts/loading'

const Dashboard = () => {
  const { setSidebarActive } = useSidebarActive()
  const [datataRevenueYearly, setDataRevenueYearly] = useState([])
  const [datataRevenueMonthly, setDataRevenueMonthly] = useState([])
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    setSidebarActive(ROUTES_ADMIN.DASHBOARD)
    fetchDatataRevenueYearly()
    fetchDatataRevenueMonthly()
  }, [])

  const fetchDatataRevenueYearly = params => {
    showLoading()
    dataAnalytisService
      .yearly(params)
      .then(data => {
        console.log(data)
        setDataRevenueYearly(data)
      })
      .catch(err => {
        handleResponseError(err)
      })
      .finally(() => {
        hideLoading()
      })
  }

  const fetchDatataRevenueMonthly = year => {
    showLoading()
    dataAnalytisService
      .monthly({ year: year ?? '2024' })
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
      {
        label: 'Number order',
        data: datataRevenueMonthly.map(item => item.orderNumber),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  }

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
          <Line data={dataMonthly} options={optionsMonthly} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
