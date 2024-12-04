const Notification = ({content}) => {
    return (
        <div>
            <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-blue-900 text-center mx-64 py-3 shadow-lg z-50">
                    {content}
            </div>
        </div>
    );
};

export default Notification;
