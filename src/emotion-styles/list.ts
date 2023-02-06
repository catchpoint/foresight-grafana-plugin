import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const actionButtonStyle = (theme: GrafanaTheme2) => css`
  &:hover {
    background-color: ${theme.colors.action.focus};
    path,
    rect {
      fill: ${theme.colors.text.primary};
    }
  }
  path,
  rect {
    fill: ${theme.colors.text.secondary};
  }
`;
export const listItemStyle = (theme: GrafanaTheme2) => css`
  &:hover {
    background-color: ${theme.colors.action.hover};
  }
`;
