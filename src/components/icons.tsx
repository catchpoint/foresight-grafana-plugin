import React from 'react';

type IconProps = {
  fill?: string;
};

export const PlayIcon: React.FC<IconProps> = ({ fill }) => {
  return (
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 224.075 224.075">
      <path
        fill={fill}
        d="M216.2,99.23L20.5,1.63c-2.1-1.1-4.8-1.6-6.9-1.6v0C5.7,0.53,0,6.33,0,14.23v195.7c0,10.5,11,17.3,20.5,12.6l195.7-98.1
			C226.7,119.23,226.7,104.53,216.2,99.23z M27.8,187.33V36.73l150.6,75L27.8,187.33z"
      />
    </svg>
  );
};

export const PauseIcon: React.FC<IconProps> = ({ fill }) => {
  return (
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 365 365">
      <rect fill={fill} x="74.5" width="73" height="365" />
      <rect fill={fill} x="217.5" width="73" height="365" />
    </svg>
  );
};
