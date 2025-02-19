import React, { useEffect, useState } from "react";
import { faBan, faBookmark, faEllipsis, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getReactionByIdPost } from "../../apis/reaction/reaction.api";
import CurrentUserInfo from "../../util/Token";
import { getCommentByIdPost, putCommentByIdPost } from "../../apis/comment/comment.api";
import { useForm } from "react-hook-form";
import AllButton from "./AllButton";

export default function Post({ post }) {
	const [like, setLike] = useState([]);
	const [dislike, setDislike] = useState([]);
	const [comment, setComment] = useState([]);
	const [isDropdownVisible, setDropdownVisible] = useState(false);

    const { register, handleSubmit } = useForm({});

	const user = CurrentUserInfo();

	useEffect(() => {
		getReactionByIdPost(post.id)
			.then((data) => {
				data.map((elem) => {
					if (elem.type === 'LIKE') {
						return setLike([...like, elem])
					} else if (elem.type === 'DISLIKE') {
						return setDislike([...dislike, elem])
					}
				})
			})
			.catch(err => console.log(err));
		
    }, []);

	useEffect(() => {
		getCommentByIdPost(post.id)
			.then(data => {
				setComment(data);
			})
			.catch(err => console.log(err));
		
    }, [post.id, post.reaction]);

	const handleVisible = (ev) => {
		ev.preventDefault();
		setDropdownVisible(!isDropdownVisible)
	}

	const onSubmit = (data) => {
		const _data = {postId: post.id,
			content: data.content,
			userId: user.id
		}
        putCommentByIdPost(_data)
			.then(res => {
				setComment([...comment, res]);
			})
			.catch(e => console.log('Error server : ' + e));
    };

  	return (
		<div className="col-8d-flex flex-column gap-5 md-7">
			<div className="post-single-box p-3 p-sm-5">
				<div className="pb-1 top-area">
					<div className="d-flex justify-content-between">
						<div className="d-flex align-items-center gap-2">
							<div className="avatar position-relative">
								<img
									className="rounded-circle"
									src={post.user.photo}
									alt="Profile"
									width="48"
									height="48"
								/>
							</div>
							<div className="text-start">
								<h6 className="m-0">{post.user.username}</h6>
								<span className="text-secondary">Active</span>
							</div>
						</div>
						<div className="dropdown-center">
							<button
							className="btn dropdown-toggle"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							>
							<FontAwesomeIcon
								className="text-secondary"
								icon={faEllipsis}
							/>
							</button>
							<ul className="dropdown-menu">
								<li>
									<a
									className="dropdown-item d-flex gap-2 align-items-center"
									href="#"
									>
									<FontAwesomeIcon icon={faBookmark} />
									<span>Save post</span>
									</a>
								</li>
								<li>
									<a
									className="dropdown-item d-flex gap-2 align-items-center"
									href="#"
									>
									<FontAwesomeIcon icon={faBan} />
									<span>Hide post</span>
									</a>
								</li>
								<li>
									<a
									className="dropdown-item d-flex gap-2 align-items-center"
									href="#"
									>
									<FontAwesomeIcon icon={faFlag} />
									<span>Report post</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="text-wrap overflow-hidden text-start w-100 py-3">
						<h5>{post.title}</h5>
						<p className="my-3">{post.content}</p>
						{/* <div className="container">
							<img src="../img/Harena-anime1.png" alt="images" className="img" />
						</div> */}
					</div>
				</div>
					<AllButton 
						post={post}
						like={like}
						dislike={dislike}
						setLike={setLike}
						setDislike={setDislike}
						FontAwesomeIcon={FontAwesomeIcon}
						handleSubmit={handleSubmit}
						handleVisible={handleVisible}
						/>
					{
						isDropdownVisible && (
							<div className="dropdown-content">
								<div className="container">
									{
										comment && (comment.map(com => (
											<div key={com.id} com={com}>
												<p> 
													<span className="text-primary"><img
														className="rounded-circle"
														src={com.user.photo}
														alt="Profile"
														width="30"
														height="30"
													/> {com.user.username}</span> {com.content}
												</p>
											</div>
										)))
									}
								</div>
							</div>
						)
					}
				<form className="my-0 d-flex gap-3"  onSubmit={handleSubmit(onSubmit)}>
					<input
						type="text"
						placeholder="write a comment..."
						className="form-control"
						required {...register("content", { required: true })}
					/>
					<div className="d-flex">
						<button className="btn btn-primary px-2 px-sm-5 px-lg-6" type="submit">
							Send
						</button>
					</div>
				</form>
			</div>
		</div>
  	);
}
