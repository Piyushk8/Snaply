"use client"

import React, {useState, useEffect, useCallback} from 'react'
import {getCldImageUrl, getCldVideoUrl} from "next-cloudinary"
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from 'dayjs';
import realtiveTime from "dayjs/plugin/relativeTime"
import {filesize} from "filesize"
export interface Video {
    publicId: string
    duration?: number
    }
dayjs.extend(realtiveTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
}

const  VideoCard: React.FC<VideoCardProps> = ({video, onDownload}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)

    const getPreviewVideoUrl = useCallback((publicId: string) => {
      return getCldVideoUrl({
          src: publicId,
          width: 600, // Increased width
          height: 338, // Adjusted height to maintain 16:9 aspect ratio
          rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
      });
  }, []);
  
  const getThumbnailUrl = useCallback((publicId: string) => {
      return getCldImageUrl({
          src: publicId,
          width: 600, // Increased width
          height: 338, // Adjusted height to match the preview size
          crop: "fill",
          gravity: "auto",
          format: "jpg",
          quality: "auto",
          assetType: "video"
      });
  }, []);
  
    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,

        })
    }, [])


 

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      }, []);

    

      useEffect(() => {
        setPreviewError(false);
      }, [isHovered]);

      const handlePreviewError = () => {
        setPreviewError(true);
      };

      return (
        <div
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <figure className="aspect-video relative">
            {isHovered ? (
              previewError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-red-500">Preview not available</p>
                </div>
              ) : (
                <video
                  src={getPreviewVideoUrl(video.publicId)}
                //   src={getPreviewVideoUrl('Attachments/attachment_6263e36f-000d-498a-baf4-c7d344918b8f')}
                  autoPlay
                  muted
                  loop
                  controls
                  className="mx-auto size-fit max-h-[30rem] rounded-2xl"
                  onError={handlePreviewError}
                  
                />
              )
            ) : (
              <img
                src={getThumbnailUrl(video.publicId)}
                alt={""}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
              <Clock size={16} className="mr-1" />
              { video?.duration && formatDuration(video?.duration)}
            </div>
          </figure>
         
        </div>
      );
}

export default VideoCard