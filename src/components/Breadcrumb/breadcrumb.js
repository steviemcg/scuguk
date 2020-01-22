import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Link } from "gatsby";

require('./breadcrumb.scss')

const formatLeafName = leaf => leaf.replace(/-/g, " ");

// create a path based on the leaf position in the branch
const formatPath = (branch, index) => branch.slice(0, index + 1).join('/')

const BreadCrumb = props => {
  const { leaf, index, branch } = props,
    leafPath = formatPath(branch, index),
    leafName = index == 0 ? 'home' : formatLeafName(leaf),
    leafItem =
      index + 1 < branch.length 
        ? <li className="breadcrumbs-crumb">
          
          <Link to={leafPath}>{leafName}</Link>
        </li>
        : <li className="breadcrumbs-crumb">{leafName}</li>

  if (isNaN(leafName))
    return leafItem

  return ''
}

const BreadCrumbList = props => {
  const path = props.match.url.replace(/\/$/, ''), // make sure url doesn't end with /
    listItems =
      path.length > 1
      && path
        .split('/')
        .map((leaf, index, branch) => 
          <BreadCrumb leaf={leaf} index={index} branch={branch} key={index} />
        )

  return listItems && <ul className="breadcrumbs">{listItems}</ul>
}

const BreadCrumbs = () => 
  <BrowserRouter><Route path="/*" render={({ match }) => <BreadCrumbList match={match} />} /></BrowserRouter>

export default BreadCrumbs