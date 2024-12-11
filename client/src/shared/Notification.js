const Notification = ({content}) => {
    return (
        <div>
            <div className="fixed top-0 left-0 right-0 rounded-b-2xl bg-sky-200 text-blue-900 text-center mx-auto max-w-4xl py-3 shadow-lg z-50">
                    {content}
            </div>
        </div>
    );
};

export default Notification;
