// import React from "react";
// import PropTypes from "prop-types";
// import { graphql, StaticQuery } from "gatsby";

// class Sponsors extends React.Component {
//   render() {
//     const { data } = this.props;
//     const { edges: sponsors } = data.allMarkdownRemark;

//     return (
//       <section>
//         {sponsors &&
//           sponsors.map(({ node: sponsor }) => (
//             <article key={sponsor.id}>
//               <img src={sponsor.image} alt={sponsor.title} />
//               <h3>{sponsor.title}</h3>
//               <p>
//                 <a href={sponsor.website} target="_blank">
//                   {sponsor.website}
//                 </a>
//               </p>
//               <p>{sponsor.description}</p>
//             </article>
//           ))}
//       </section>
//     );
//   }
// }

// Sponsors.propTypes = {
//   data: PropTypes.shape({
//     allMarkdownRemark: PropTypes.shape({
//       edges: PropTypes.array
//     })
//   })
// };

// export default () => (
//   <StaticQuery
//     query={graphql`
//       query SponsorsQuery {
//         allMarkdownRemark(
//           filter: { frontmatter: { contentType: { eq: "sponsor" } } }
//         ) {
//           edges {
//             node {
//               id
//               frontmatter {
//                 title
//                 description
//                 image
//                 website
//               }
//             }
//           }
//         }
//       }
//     `}
//     render={data => <Sponsors data={data} />}
//   />
// );
