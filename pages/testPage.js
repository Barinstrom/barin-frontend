import ReCAPTCHA from "react-google-recaptcha";



export default function testPage() {

  const site_key = process.env.NEXT_PUBLIC_SITE_KEY

  function handleVerify(value) {
    console.log(value)
  }

  return (
    <ReCAPTCHA
      sitekey={site_key}
      onChange={handleVerify}
    />
  );
}

