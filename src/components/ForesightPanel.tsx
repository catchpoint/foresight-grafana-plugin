import React, { useEffect, useState, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import {  ForesightPanelConfig } from '../types';
import { Tab, TabsBar } from '@grafana/ui';

import * as ForesightApi from '@runforesight/foresight-javascript-client';

import './common.scss';

const TABS = [
  {
    label: 'Tryer Tab 1',
    active: true,
  },
  {
    label: 'Tryer Tab 2',
    active: false,
  },
];

export const ForesightPanel: React.FC<PanelProps<ForesightPanelConfig>> = ({ options, data, width, height }) => {
  const [tabs, setTabs] = useState(TABS);
  const projectApi = useRef(
    new ForesightApi.ProjectsApi(new ForesightApi.Configuration({
      apiKey: `ApiKey ${options.apiKey}`,
      basePath: options.basePath
    })));

  /*
    An example usage of foresight api
  **/
  useEffect(() => {
    projectApi.current = new ForesightApi.ProjectsApi(new ForesightApi.Configuration({
      apiKey: `ApiKey ${options.apiKey}`,
      basePath: options.basePath
    }));
  },[options.apiKey, options.basePath]);

  const getProjectForTest = async () => {
    const projects = await projectApi.current.getProjectsUsingGET();
    console.log(projects);
  }

  const getTabHeader = () => {
    return (
      <div>
        <button onClick={getProjectForTest}>Test</button>
        <TabsBar>
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={tab.label}
                label={tab.label}
                active={tab.active}
                onChangeTab={() => setTabs(tabs.map((tab, idx) => ({ ...tab, active: idx === index })))}
              />
            );
          })}
        </TabsBar>
      </div>
    );
  };

  return (
    <div className={'foresight-panel-container'} style={{ width: `${width}px`, height: `${height}px` }}>
      {getTabHeader()}
    </div>
  );
};
