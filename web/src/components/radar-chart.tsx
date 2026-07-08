'use client';

import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RadarChartProps {
  results: any[];
}

export const RadarChart = ({ results }: RadarChartProps) => {
  const { theme } = useTheme();
  const apexChartTheme = theme === 'dark' ? 'dark' : 'light';

  // Map results to obtain names: Abertura, Conscienciosidade, Extroversão, Amabilidade, Neuroticismo
  const categories = results.map((r) => {
    const title = r.title;
    if (title.toLowerCase().startsWith('abertura')) return 'Abertura';
    return title;
  });

  const options: ApexOptions = {
    theme: {
      mode: apexChartTheme
    },
    chart: {
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent'
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#871217'] // Carmine stroke to match Almanova colors
    },
    fill: {
      opacity: 0.25,
      colors: ['#FFBA1F'] // Gold fill inside
    },
    markers: {
      size: 4,
      colors: ['#871217'],
      strokeWidth: 2
    },
    yaxis: {
      show: false, // hide values on radar to keep it clean like the screenshot
      min: 0,
      max: 120,
      tickAmount: 4
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: apexChartTheme === 'dark' ? '#fff' : '#334155',
          fontSize: '13px',
          fontWeight: 600
        }
      }
    },
    colors: ['#871217']
  };

  const series = [
    {
      name: 'Pontuação',
      data: results.map((r) => r.score)
    }
  ];

  return (
    <div className='flex justify-center w-full max-w-[450px] mx-auto'>
      <ApexChart
        type='radar'
        options={options}
        series={series}
        height={320}
        width='100%'
      />
    </div>
  );
};
