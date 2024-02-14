import React from 'react'

const NotFoundPage = () => {
  return (
    <>
      <a
        href="https://mr.sharafdin.com/"
        className="viewFull"
        target="_parent"
      >
        Go back to home page :)
      </a>
      <section>
        <div className="error">
          <div className="wrap">
            <div className={404}>
              <pre>
                <code>
                  {"\n"}
                  {"\t"} <span className="green">&lt;!</span>
                  <span>DOCTYPE html</span>
                  <span className="green">&gt;</span>
                  {"\n"}
                  <span className="orange">&lt;html&gt;</span>
                  {"\n"}
                  {"    "}
                  <span className="orange">&lt;style&gt;</span>
                  {"\n"}
                  {"   "}* {"{"}
                  {"\n"}
                  {"\t"}
                  {"\t"}
                  {"        "}
                  <span className="green">everything</span>:
                  <span className="blue">awesome</span>;{"\n"}
                  {"}"}
                  {"\n"}
                  {"     "}
                  <span className="orange">&lt;/style&gt;</span>
                  {"\n"} <span className="orange">&lt;body&gt;</span> {"\n"}
                  {"              "}ERROR 404!{"\n"}
                  {"\t"}
                  {"\t"}
                  {"\t"}
                  {"\t"}NOT FOUND! WHAT YOU'RE LOOKING FOR{"\n"}
                  {"\t"}
                  {"\t"}
                  {"\t"}
                  {"\t"}
                  <span className="comment">
                    &lt;!--The file you are looking for, {"\n"}
                    {"\t"}
                    {"\t"}
                    {"\t"}
                    {"\t"}
                    {"\t"}is not where you think it is.--&gt;{"\n"}
                    {"\t"}
                    {"\t"}
                  </span>
                  {"\n"} <span className="orange" /> {"\n"}
                  {"\t"}
                  {"\t"}
                  {"\t"}
                  {"  "}
                  {"\n"}
                  {"\n"}
                  {"\n"}
                </code>
              </pre>
            </div>
            <code>
              <br />
              <span className="info">
                <br />
                <span className="orange">&nbsp;&lt;/body&gt;</span>
                <br />
                <span className="orange">&lt;/html&gt;</span>
              </span>
            </code>
          </div>
        </div>
      </section>
    </>
  )
}

export default NotFoundPage
