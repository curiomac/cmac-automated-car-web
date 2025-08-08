import React, { useState, useEffect } from 'react';
import { 
  FiPower, FiActivity, FiAlertCircle, FiMenu, 
  FiClock, FiBattery, FiZap, FiBarChart2 
} from 'react-icons/fi';
import { 
  FaFan, FaTemperatureHigh, FaTint, 
  FaRunning, FaRuler, FaLightbulb 
} from 'react-icons/fa';
import { GiPressureCooker } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';

const IoTDashboard = () => {
  const [powerStatus, setPowerStatus] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logs, setLogs] = useState([]);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [batteryStatus, setBatteryStatus] = useState('charging');
  const [sensors, setSensors] = useState([
    { id: 1, name: 'Temperature', status: 'normal', icon: <FaTemperatureHigh />, value: '24.5°C' },
    { id: 2, name: 'Humidity', status: 'normal', icon: <FaTint />, value: '45%' },
    { id: 3, name: 'Motion', status: 'normal', icon: <FaRunning />, value: 'Inactive' },
    { id: 4, name: 'Proximity', status: 'normal', icon: <FaRuler />, value: '0.5m' },
    { id: 5, name: 'Pressure', status: 'normal', icon: <GiPressureCooker />, value: '1013 hPa' },
    { id: 6, name: 'Light', status: 'normal', icon: <FaLightbulb />, value: '320 lux' },
  ]);
  const [motors, setMotors] = useState([
    { id: 1, name: 'Cooling Fan', status: 'idle', rpm: 0 },
    { id: 2, name: 'Conveyor Belt', status: 'idle', rpm: 0 },
  ]);

  // Battery simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        const change = batteryStatus === 'charging' ? 1 : -1;
        const newLevel = Math.max(0, Math.min(100, prev + change));
        if (newLevel === 100) setBatteryStatus('discharging');
        if (newLevel === 20) setBatteryStatus('charging');
        return newLevel;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [batteryStatus]);

  // Motor simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMotors(prevMotors => 
        prevMotors.map(motor => {
          if (motor.status === 'active') {
            const rpmChange = Math.floor(Math.random() * 50) - 25;
            const newRpm = Math.max(0, motor.rpm + rpmChange);
            return { ...motor, rpm: Math.min(newRpm, 2500) };
          }
          return motor;
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Log simulation
  useEffect(() => {
    const sampleLogs = [
      { id: 1, message: 'System initialized successfully', timestamp: new Date(), type: 'info' },
      { id: 2, message: 'Connected to Arduino device on port COM3', timestamp: new Date(), type: 'success' },
      { id: 3, message: 'All sensors online and reporting', timestamp: new Date(), type: 'info' },
      { id: 4, message: 'Security protocol enabled', timestamp: new Date(), type: 'info' },
      { id: 5, message: 'Temperature sensor calibrated', timestamp: new Date(), type: 'info' },
      { id: 6, message: 'Network connection established', timestamp: new Date(), type: 'success' },
    ];
    setLogs(sampleLogs);

    const logInterval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        message: `System health check completed at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        type: 'info'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 15000);

    return () => clearInterval(logInterval);
  }, []);

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      timestamp: new Date(),
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const triggerAlert = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    setSensors(sensors.map(sensor => 
      sensor.id === sensorId 
        ? { 
            ...sensor, 
            status: 'alert',
            value: sensor.id === 1 ? '38.2°C' : 
                  sensor.id === 2 ? '85%' : 
                  sensor.id === 3 ? 'Active!' : 
                  sensor.id === 4 ? '0.1m' : 
                  sensor.id === 5 ? '1080 hPa' : '950 lux'
          } 
        : sensor
    ));
    
    addLog(`Alert triggered: ${sensor.name} sensor detected abnormal value`, 'warning');
    
    setTimeout(() => {
      setSensors(sensors.map(sensor => 
        sensor.id === sensorId 
          ? { 
              ...sensor, 
              status: 'normal',
              value: sensor.id === 1 ? '24.5°C' : 
                    sensor.id === 2 ? '45%' : 
                    sensor.id === 3 ? 'Inactive' : 
                    sensor.id === 4 ? '0.5m' : 
                    sensor.id === 5 ? '1013 hPa' : '320 lux'
            } 
          : sensor
      ));
      addLog(`Alert cleared: ${sensor.name} sensor returned to normal range`, 'info');
    }, 8000);
  };

  const toggleMotor = (motorId) => {
    setMotors(motors.map(motor => {
      const newStatus = motor.status === 'idle' ? 'active' : 'idle';
      const newRpm = newStatus === 'active' ? 1200 : 0;
      addLog(`${motor.name} ${newStatus === 'active' ? 'activated at 1200 RPM' : 'deactivated'}`, 'info');
      return motor.id === motorId 
        ? { ...motor, status: newStatus, rpm: newRpm } 
        : motor;
    }));
  };

  const togglePower = () => {
    const newStatus = !powerStatus;
    setPowerStatus(newStatus);
    
    if (!newStatus) {
      setMotors(motors.map(motor => ({
        ...motor,
        status: 'idle',
        rpm: 0
      })));
    }
    
    addLog(`System power ${newStatus ? 'ON - All systems booting' : 'OFF - Shutdown sequence initiated'}`, newStatus ? 'success' : 'warning');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleBatteryStatus = () => {
    setBatteryStatus(prev => prev === 'charging' ? 'discharging' : 'charging');
    addLog(`Battery set to ${batteryStatus === 'charging' ? 'discharging' : 'charging'} mode`, 'info');
  };

  const getBatteryColor = () => {
    if (batteryLevel <= 20) return 'bg-red-500';
    if (batteryLevel <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderBatteryIcon = () => {
    return (
      <div className="relative w-16 h-8 border-2 border-gray-300 rounded flex items-center justify-end px-1">
        <div className="absolute h-3 w-1 bg-gray-300 -right-1 top-1/2 transform -translate-y-1/2"></div>
        <div className={`absolute left-0.5 top-0.5 bottom-0.5 ${getBatteryColor()} rounded-sm`} 
             style={{ width: `${batteryLevel}%` }}></div>
        <div className="text-xs font-bold relative z-10 text-white mix-blend-difference">
          {batteryLevel}%
        </div>
      </div>
    );
  };

  const getSensorIcon = (sensorId) => {
    switch(sensorId) {
      case 1: return <FaTemperatureHigh className="text-orange-500" />;
      case 2: return <FaTint className="text-blue-500" />;
      case 3: return <FaRunning className="text-purple-500" />;
      case 4: return <FaRuler className="text-green-500" />;
      case 5: return <GiPressureCooker className="text-red-500" />;
      case 6: return <FaLightbulb className="text-yellow-500" />;
      default: return <FiActivity />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Wider Logs Panel */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 bg-gray-900 text-gray-200 overflow-hidden flex flex-col border-r border-gray-700`}>
        <div className="p-5 border-b border-gray-700 flex items-center justify-between bg-gray-800">
          <h2 className="text-xl font-semibold flex items-center">
            <FiActivity className="mr-3 text-blue-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              System Logs
            </span>
          </h2>
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition-colors">
            <IoMdClose size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-screen p-4 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium">Recent Activity</h3>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
              {logs.length} entries
            </span>
          </div>
          
          {logs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FiActivity className="mx-auto mb-2" size={24} />
              <p>No activity logs available</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {logs.map(log => (
                <li 
                  key={log.id} 
                  className={`p-4 rounded-lg transition-all ${log.type === 'warning' ? 'bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-500' : 
                              log.type === 'success' ? 'bg-green-900 bg-opacity-20 border-l-4 border-green-500' : 
                              'bg-gray-800 bg-opacity-50 border-l-4 border-blue-500'} hover:bg-opacity-70`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 mt-1 h-2 w-2 rounded-full ${
                      log.type === 'warning' ? 'bg-yellow-500' : 
                      log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center">
                        <FiClock className="mr-1" />
                        {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">System Status</span>
            <span className={`text-xs px-2 py-1 rounded-full ${powerStatus ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {powerStatus ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 text-gray-600 hover:text-gray-900">
                <FiMenu size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="text-blue-600">Arduino</span> IoT Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                {renderBatteryIcon()}
                <span className="text-sm font-medium text-gray-700">
                  {batteryStatus === 'charging' ? 'Charging' : 'Discharging'}
                </span>
                <button onClick={toggleBatteryStatus} className="text-gray-600 hover:text-blue-600">
                  <FiZap size={18} />
                </button>
              </div>
              
              <button 
                onClick={togglePower}
                className={`flex items-center px-5 py-2.5 rounded-lg transition-all shadow-sm ${powerStatus ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                <FiPower className="mr-2" />
                {powerStatus ? 'Power On' : 'Power Off'}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* System Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">System Status</h3>
                    <p className="text-2xl font-semibold text-gray-800">
                      {powerStatus ? 'Operational' : 'Offline'}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${powerStatus ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    <FiPower size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {powerStatus ? 'All systems functioning normally' : 'System is powered down'}
                  </p>
                </div>
              </div>
              
              {/* Alerts */}
              <div className={`bg-white rounded-xl shadow-sm border ${sensors.some(s => s.status === 'alert') ? 'border-red-200 bg-red-50' : 'border-gray-200'} p-5 hover:shadow-md transition-all`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Alerts</h3>
                    <p className={`text-2xl font-semibold ${sensors.some(s => s.status === 'alert') ? 'text-red-600' : 'text-gray-800'}`}>
                      {sensors.filter(s => s.status === 'alert').length}
                      <span className="text-sm font-normal ml-1">
                        /{sensors.length} sensors
                      </span>
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${sensors.some(s => s.status === 'alert') ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
                    <FiAlertCircle size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className={`text-xs ${sensors.some(s => s.status === 'alert') ? 'text-red-500' : 'text-gray-500'}`}>
                    {sensors.some(s => s.status === 'alert') 
                      ? `${sensors.filter(s => s.status === 'alert').length} sensor(s) require attention` 
                      : 'No active alerts'}
                  </p>
                </div>
              </div>
              
              {/* Battery */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Battery</h3>
                    <p className="text-2xl font-semibold text-gray-800">
                      {batteryLevel}%
                      <span className="text-sm font-normal ml-1">
                        {batteryStatus === 'charging' ? '(Charging)' : '(Discharging)'}
                      </span>
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${getBatteryColor().replace('bg-', 'bg-opacity-20 bg-')} ${getBatteryColor().replace('bg-', 'text-')}`}>
                    <FiBattery size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getBatteryColor()}`}
                      style={{ width: `${batteryLevel}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {batteryStatus === 'charging' ? 'Estimated full charge in 2h 15m' : 'Remaining runtime ~4h 30m'}
                  </p>
                </div>
              </div>
              
              {/* Power Draw */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Power Draw</h3>
                    <p className="text-2xl font-semibold text-gray-800">
                      {motors.filter(m => m.status === 'active').length * 15 + 
                       sensors.filter(s => s.status === 'alert').length * 5}W
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FiZap size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {motors.filter(m => m.status === 'active').length} motor(s) active
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sensors Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FiActivity className="mr-2 text-blue-600" />
                  Sensor Monitoring
                </h2>
                <div className="text-sm text-gray-500 flex items-center">
                  <span className={`h-2 w-2 rounded-full ${sensors.some(s => s.status === 'alert') ? 'bg-red-500 animate-pulse' : 'bg-green-500'} mr-2`}></span>
                  {sensors.filter(s => s.status === 'alert').length} alerts
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensors.map(sensor => (
                  <div 
                    key={sensor.id} 
                    className={`bg-white rounded-lg shadow-sm border ${sensor.status === 'alert' ? 'border-red-200' : 'border-gray-200'} hover:shadow-md transition-all cursor-pointer overflow-hidden`}
                    onClick={() => triggerAlert(sensor.id)}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800 flex items-center">
                            {getSensorIcon(sensor.id)}
                            <span className="ml-2">{sensor.name}</span>
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">Current reading</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${sensor.status === 'alert' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
                          {sensor.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className={`text-2xl font-semibold ${sensor.status === 'alert' ? 'text-red-600' : 'text-gray-800'}`}>
                          {sensor.value}
                        </p>
                        {sensor.status === 'alert' && (
                          <button className="text-xs text-red-600 hover:text-red-800">
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={`h-1 ${sensor.status === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Motor Controls Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaFan className="mr-2 text-blue-600" />
                  Motor Controls
                </h2>
                <div className="text-sm text-gray-500">
                  {motors.filter(m => m.status === 'active').length} active
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {motors.map(motor => (
                  <div key={motor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-800">{motor.name}</h3>
                          <p className="text-sm text-gray-500">Current status</p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${motor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {motor.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>RPM</span>
                          <span>{motor.rpm} / 2500</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
                            style={{ width: `${(motor.rpm / 2500) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleMotor(motor.id)}
                        className={`w-full py-2.5 rounded-md transition-all ${motor.status === 'active' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'}`}
                      >
                        {motor.status === 'active' ? 'Deactivate Motor' : 'Activate Motor'}
                      </button>
                    </div>
                    <div className={`h-1 ${motor.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'}`}></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* System Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">System Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <FiActivity className="mr-3 text-blue-600" />
                    <span>Run Diagnostics</span>
                  </div>
                  <span className="text-xs text-gray-500">Check system health</span>
                </button>
                <button className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <FiClock className="mr-3 text-blue-600" />
                    <span>Schedule Maintenance</span>
                  </div>
                  <span className="text-xs text-gray-500">Set downtime window</span>
                </button>
                <button className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <FiAlertCircle className="mr-3 text-blue-600" />
                    <span>Emergency Stop</span>
                  </div>
                  <span className="text-xs text-gray-500">Immediate shutdown</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IoTDashboard;