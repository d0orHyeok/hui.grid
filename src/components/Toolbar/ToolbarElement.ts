import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import ToolbarView from './ToolbarView';

export type ToolbarState = DefaultState & {};

export default class ToolbarElement extends Component<ToolbarView, ToolbarState> {
  init() {}
}
