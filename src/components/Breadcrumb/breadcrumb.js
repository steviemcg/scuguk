import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Link } from 'react-router-dom'
// styles
// require('./styles/_breadcrumbs.scss')

// replace underscores with spaces in path names
const formatLeafName = leaf => leaf.replace('_', ' ')

// create a path based on the leaf position in the branch
const formatPath = (branch, index) => branch.slice(0, index + 1).join('/')

// output the individual breadcrumb links
const BreadCrumb = props => {
  const { leaf, index, branch } = props,
    leafPath = formatPath(branch, index),
    leafName = index == 0 ? 'home' : formatLeafName(leaf),
    leafItem =
      index + 1 < branch.length 
        ? <li className="breadcrumbs__crumb">
          <Link to={leafPath}>{leafName}</Link>
          <span className="separator">&raquo;</span>
        </li>
        : <li className="breadcrumbs__crumb">{leafName}</li>
  // the slug doesn't need a link or a separator, so we output just the leaf name

  return leafItem
}

const BreadCrumbList = props => {
  const path = props.match.url,
    listItems =
      // make sure we're not home (home return '/' on url)
      path.length > 1
      && path
        // create an array of leaf names
        .split('/')
        // send our new array to BreadCrumb for formating
        .map((leaf, index, branch) => 
          <BreadCrumb leaf={leaf} index={index} branch={branch} key={index} />
        )

  // listItem will exist anywhere but home
  return listItems && <ul className="breadcrumbs">{listItems}</ul>
}

const BreadCrumbs = props => 
  <Route path="/*" render={({ match }) => <BreadCrumbList match={match} />} />

export default BreadCrumbs