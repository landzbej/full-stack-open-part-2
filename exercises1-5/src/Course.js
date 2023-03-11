const Header = (props) => {  
  return (
    <>
      <h2>{props.course}</h2>
    </>
  )
}

const Content = (props) => {
  return (
    <>
      {props.parts.map(part => 
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>)
      }
    </>
  )
}



const Total = (props) => {
 return (
    <>
      <p><b>Number of exercises {props.parts.reduce((accumulator,currentValue) => 
      accumulator + currentValue.exercises, 0)}</b></p>
    </>
  )
}

const Course = (props) => {
  return (
    <>
      <Header course={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total parts={props.course.parts}/>
    </>
  )
}

export default Course;