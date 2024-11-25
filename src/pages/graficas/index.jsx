import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import { graficaService } from '../../services/grafica.service';
import Chart from 'react-apexcharts';
import 'react-toastify/dist/ReactToastify.css';
import './graficas.css'

const Graficas = () => {
  const { user } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [gastos, setGastos] = useState({ labels: [], series: [] });
  const [depositos, setDepositos] = useState({ labels: [], series: [] });

  // Opción para la gráfica, cambiando dinámicamente las etiquetas
  const getOptions = (labels, series) => ({
    chart: {
      type: 'donut',
    },
    labels: labels, // Etiquetas dinámicas basadas en los datos
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#333',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#666',
              offsetY: 10,
              formatter: (val, opts) => {
                if (opts.series && opts.series.length > 0) {
                  const value = opts.series[opts.seriesIndex];
                  return value !== undefined ? `$ ${value.toFixed(2)}` : '';
                }
                return ''; 
              },
            },
            total: {
              show: false,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        // Validación para asignar iconos a cada categoría
        const iconos = {
          "Ahorro": "💰",      // Ahorro
          "Inversión": "📈",   // Inversión
          "Sueldo": "💼",      // Sueldo
          "Ventas": "📊",      // Ventas
          "Reembolso": "💵",   // Reembolso
          "Compras": "🛒",     // Compras
          "Alimentación": "🍔", // Alimentación
          "Transporte": "🚗",  // Transporte
          "Entretenimiento": "🎉", // Entretenimiento
          "Salud": "🏥",       // Salud
        };
  
        const categoria = labels[opts.seriesIndex];
        return iconos[categoria] || '';  // Retorna el ícono correspondiente a la categoría
      },
      style: {
        fontSize: '25px',
        fontWeight: 'bold',
        colors: ['#fff'],
      },
    },
    legend: {
      position: 'bottom',
    },
  });
  

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);

      // Obtener los gastos
      graficaService.getExpenses(user.token, user._id).then(data => {

        // Asegurarse de que los datos están correctos antes de establecer el estado
        if (data.totals && Array.isArray(data.totals)) {
          setGastos({
            labels: data.types || [], // Etiquetas para los gastos
            series: data.totals || [], // Valores para los gastos
          });
        }
      }).catch(error => {
        console.error("Error al obtener los gastos:", error);
      });

      // Obtener los depósitos
      graficaService.getDeposits(user.token, user._id).then(data => {

        // Asegurarse de que los datos están correctos antes de establecer el estado
        if (data.totals && Array.isArray(data.totals)) {
          setDepositos({
            labels: data.types || [], // Etiquetas para los depósitos
            series: data.totals || [], // Valores para los depósitos
          });
        }
      }).catch(error => {
        console.error("Error al obtener los depósitos:", error);
      });
    }
  }, [user]);

  // Asegurarse de que los datos estén listos antes de renderizar los gráficos
  if (!gastos.series.length || !depositos.series.length) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  // Función para calcular el total de los valores
  const calcularTotal = (series) => series.reduce((acc, val) => acc + val, 0).toFixed(2);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', padding: '50px' }}>
      <Card 
        title="Gráfica Depósitos" 
        bordered={false} 
        style={{ 
          width: '100%', 
          maxWidth: '800px', // Aumento del tamaño máximo
          flexBasis: '100%', // Asegura que ocupe el 48% del contenedor
          minHeight: '500px', // Ajusta la altura mínima para hacerla más larga
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>
          Total $ {calcularTotal(depositos.series)}
        </div>
        <Chart
          options={getOptions(depositos.labels, depositos.series)} 
          series={depositos.series} 
          type="donut"
          width="100%"
          height={350}
        />
      </Card>
      <Card 
        title="Gráfica Gastos" 
        bordered={false} 
        style={{ 
          width: '100%', 
          maxWidth: '800px', // Aumento del tamaño máximo
          flexBasis: '100%', // Asegura que ocupe el 48% del contenedor
          minHeight: '500px', // Ajusta la altura mínima para hacerla más larga
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>
          Total $ {calcularTotal(gastos.series)}
        </div>
        <Chart
          options={getOptions(gastos.labels, gastos.series)} 
          series={gastos.series} 
          type="donut"
          width="100%"
          height={350}
        />
      </Card>
    </div>
  );
};

export default Graficas;
