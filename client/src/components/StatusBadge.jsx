import React from 'react';
import { Clock, CheckCircle2, UserCheck, Navigation, MapPin, Check, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="badge badge-pending">
          <Clock size={13} />
          Pending Dispatch
        </span>
      );
    case 'Accepted':
      return (
        <span className="badge badge-accepted">
          <CheckCircle2 size={13} />
          Accepted by Driver
        </span>
      );
    case 'Ambulance Assigned':
      return (
        <span className="badge badge-assigned">
          <UserCheck size={13} />
          Ambulance Assigned
        </span>
      );
    case 'On the Way':
      return (
        <span className="badge badge-onway">
          <Navigation size={13} className="animate-spin" />
          On the Way
        </span>
      );
    case 'Arrived at Pickup':
      return (
        <span className="badge badge-arrived">
          <MapPin size={13} />
          Arrived at Pickup
        </span>
      );
    case 'Completed':
      return (
        <span className="badge badge-completed">
          <Check size={13} />
          Trip Completed
        </span>
      );
    case 'Cancelled':
      return (
        <span className="badge badge-cancelled">
          <XCircle size={13} />
          Cancelled
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
