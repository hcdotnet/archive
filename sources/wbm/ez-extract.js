//const url = document.URL;
const url = window.location;
const buildId = document.getElementsByClassName("button download_btn")[0]
  .attributes["data-upload_id"].textContent;
const buildDate =
  document.getElementsByClassName("update_timestamp")[0].childNodes[1].title;

const msg = `{
    "url": "${url}",
    "buildId": "${buildId}",
    "buildDate": "${buildDate}"
}`;
//alert(msg);
//console.log(msg);
navigator.clipboard.writeText(msg);
