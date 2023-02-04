const url = window.location;
const elems = document.getElementsByClassName("button download_btn");
const buildId =
  elems[elems.length - 1].attributes["data-upload_id"].textContent;
const buildDate =
  document.getElementsByClassName("update_timestamp")[0].childNodes[1].title;

const msg = `{
    "url": "${url}",
    "buildId": "${buildId}",
    "buildDate": "${buildDate}"
}`;
navigator.clipboard.writeText(msg);
