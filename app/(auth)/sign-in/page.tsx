import SignInForm from "@/components/form/SignInForm";

const page = () => {
  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="w-1/3">
        <SignInForm />
      </div>
    </div>
  );
};

export default page;
