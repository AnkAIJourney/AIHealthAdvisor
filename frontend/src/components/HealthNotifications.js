import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Calendar,
  Clock,
} from 'lucide-react';
import './HealthNotifications.css';

const HealthNotifications = () => {
  const [notifications, setNotifications] = useState ([]);
  const [showAll, setShowAll] = useState (false);

  const healthTips = React.useMemo (
    () => [
      {
        id: 1,
        type: 'tip',
        icon: Heart,
        title: 'Daily Health Tip',
        message: 'Regular hydration helps maintain optimal blood viscosity and nutrient transport.',
        priority: 'info',
        timestamp: new Date (Date.now () - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 2,
        type: 'reminder',
        icon: Calendar,
        title: 'Health Check Reminder',
        message: 'Consider scheduling your next blood test in 3 months for continued monitoring.',
        priority: 'medium',
        timestamp: new Date (Date.now () - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: 3,
        type: 'alert',
        icon: AlertTriangle,
        title: 'Health Alert',
        message: 'Based on your last analysis, monitor your iron levels and consider iron-rich foods.',
        priority: 'high',
        timestamp: new Date (Date.now () - 10 * 60 * 1000), // 10 minutes ago
      },
      {
        id: 4,
        type: 'success',
        icon: CheckCircle,
        title: 'Great Progress!',
        message: 'Your cardiovascular markers show excellent improvement since last month.',
        priority: 'success',
        timestamp: new Date (Date.now () - 5 * 60 * 1000), // 5 minutes ago
      },
    ],
    []
  );

  useEffect (
    () => {
      // Simulate receiving notifications
      const timer = setTimeout (() => {
        setNotifications (healthTips);
      }, 1000);

      return () => clearTimeout (timer);
    },
    [healthTips]
  );

  const removeNotification = id => {
    setNotifications (notifications.filter (notif => notif.id !== id));
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#CC4A1F';
      case 'medium':
        return '#FF6B35';
      case 'success':
        return '#FF8E3C';
      default:
        return '#FFB347';
    }
  };

  const getTimeAgo = timestamp => {
    const now = new Date ();
    const diff = now - timestamp;
    const minutes = Math.floor (diff / 60000);
    const hours = Math.floor (minutes / 60);

    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice (0, 3);

  return (
    <div className="health-notifications">
      <motion.div
        className="notifications-header"
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      >
        <div className="header-content">
          <Bell className="bell-icon" />
          <h3>Health Notifications</h3>
          <span className="notification-count">{notifications.length}</span>
        </div>

        {notifications.length > 3 &&
          <button
            className="show-all-btn"
            onClick={() => setShowAll (!showAll)}
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>}
      </motion.div>

      <AnimatePresence>
        {visibleNotifications.map ((notification, index) => (
          <motion.div
            key={notification.id}
            className={`notification-item ${notification.priority}`}
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 50}}
            transition={{delay: index * 0.1, duration: 0.3}}
          >
            <div className="notification-content">
              <div
                className="notification-icon"
                style={{color: getPriorityColor (notification.priority)}}
              >
                <notification.icon />
              </div>

              <div className="notification-text">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <Clock className="time-icon" />
                  <span className="notification-time">
                    {getTimeAgo (notification.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="close-btn"
              onClick={() => removeNotification (notification.id)}
            >
              <X />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 &&
        <motion.div
          className="no-notifications"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5}}
        >
          <Activity className="no-notif-icon" />
          <p>No new health notifications</p>
        </motion.div>}
    </div>
  );
};

export default HealthNotifications;
