interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
    return (
        <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`} />
    );
};

export const ProjectCardSkeleton = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-20 h-4" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
    );
};

export const TaskCardSkeleton = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-4 h-4" />
            </div>
            <Skeleton className="h-5 w-full mb-1" />
            <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-12" />
            </div>
        </div>
    );
};
