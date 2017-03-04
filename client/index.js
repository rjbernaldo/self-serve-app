import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router } from 'react-router'
import { routes } from '../shared/routes'

render(
  <Router routes={ routes } history={ browserHistory } />,
  document.getElementById('app')
)