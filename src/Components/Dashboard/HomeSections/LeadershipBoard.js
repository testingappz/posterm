import React, { Component } from "react";

export default class LeadershipBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div class="container">
          <div class="referral-box-container">
            <h1>Top Inviters</h1>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Invited</th>
                    <th scope="col">Pending</th>
                    <th scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.leaders &&
                    this.props.leaders.length > 0 &&
                    this.props.leaders.map((obj, id) => {
                      return (
                        <tr>
                          <td>
                            <div class="winner-img">
                              <img
                                src={
                                  obj.profile_picture_url
                                    ? obj.profile_picture_url
                                    : "./home-img/placeholder.svg"
                                }
                                class="img-fluid"
                              />
                            </div>
                          </td>
                          <td>{obj.name}</td>
                          <td>{obj.invites}</td>
                          <td>{obj.pending ? obj.pending : 0}</td>
                          <td>{obj.referral_count ? obj.referral_count : 0}</td>
                        </tr>

                        /*<div class="referral-inner-box">
                    <div class="d-flex">
                      <div class="star">
                        <span class="winner"></span>
                      </div>
                      <div class="winner-img">
                        <img
                          src={
                            obj.profile_picture_url
                              ? obj.profile_picture_url
                              : "./home-img/placeholder.svg"
                          }
                          class="img-fluid"
                        />
                      </div>
                      <div class="winner-designation">
                        <span class="w-name">{obj.name}</span>
                        
                      </div>
                      {this.props.referrals &&
                        this.props.referrals.length > 0 &&
                        this.props.referrals.map((objx, idx) => {
                          if (objx.user_id === obj._id) {
                            console.log(objx.invites_num);
                            return (
                              <div class="per-bar">
                                {" "}
                                <span class="per-number">
                                  {objx.invites_num ? objx.invites_num : 0}
                                </span>{" "}
                                <span class="per-number">
                                  {objx.invites_num
                                    ? objx.invites_num - obj.referral_count
                                    : 0}
                                </span>
                              </div>
                            );
                          }else{
                            
                          }
                        })}
                      <div class="per-bar">
                    

                        <span class="per-number">{obj.referral_count}</span>
                      </div>
                    </div>
                  </div>*/
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
