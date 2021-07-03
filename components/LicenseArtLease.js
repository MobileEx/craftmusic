import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  Modal,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import NonExClusiveArt from './NonExClusiveArt';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS, STYLES } from '../global';
import Button from './Button';

class LicenseArtLease extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      royalty: '25',
      nontransform: '75',
      adfee: '0',
      adtimes: 'unlimited',
      date: '',
    };
  }

  async createPDF(htmlStr) {
    const { config, fs } = RNFetchBlob;
    const { DownloadDir } = fs.dirs;

    const options = {
      html: htmlStr,
      fileName: 'NON-EXCLUSIVE ART LICENSE',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    // console.log('pdf-->',file.filePath);
    const shareOptions = {
      title: 'Share file',
      failOnCancel: true,
      saveToFiles: true,
      url: file.filePath, // base64 with mimeType or path to local file
    };
    Share.open(shareOptions);
    // alert('successfully downloaded');
  }

  onCheckTerm() {
    this.props.onClose();
    this.props.isAgree();
  }

  closeTerm() {
    this.props.onClose();
    if (this.props.craftData == '' || this.props.userProfileData == '') {
      this.props.royaltyData(
        this.state.royalty,
        this.state.nontransform,
        this.state.adfee,
        this.state.adtimes
      );
    }
    // console.log('royaltyData-->',this.state.royalty,this.state.nontransform,this.state.adfee,this.state.adtimes);
  }

  componentDidMount() {
    const date = new Date().getDate(); // Current Date
    const month = new Date().getMonth() + 1; // Current Month
    const year = new Date().getFullYear(); // Current Year
    this.setState({ date: `${date}/${month}/${year}` });
  }

  render() {
    const { onClose, status, onCloseRequest, userProfileData, craftData } = this.props;
    if (craftData != '' || userProfileData != '') {
      const htmlStr =
        userProfileData != ''
          ? NonExClusiveArt.NonExclusiveArtTxt.replace('[BUYER]', userProfileData.username)
          : NonExClusiveArt.NonExclusiveArtTxt;
      const htmlStr1 =
        craftData != ''
          ? htmlStr.replace('[SELLER]', craftData.store_owner.name)
          : NonExClusiveArt.NonExclusiveArtTxt;
      var htmlStrFinal =
        this.state.date != ''
          ? htmlStr1.replace('[DATE]', String(this.state.date))
          : NonExClusiveArt.NonExclusiveArtTxt;
      var htmlWithRoyalty = htmlStrFinal.replace(/xxx/g, craftData.craft_items[0].royalty);
      var htmlWithNonTransRoyalty = htmlWithRoyalty.replace(
        /yyy/g,
        craftData.craft_items[0].non_transformative_royalty
      );
      var htmlWithAddFree = htmlWithNonTransRoyalty.replace(
        /zzz/g,
        craftData.craft_items[0].adversting
      );
      var htmlWithAdTimes = htmlWithAddFree.replace(
        /www/g,
        craftData.craft_items[0].number_of_ads_allowed
      );
    } else {
      htmlStrFinal = NonExClusiveArt.NonExclusiveArtTxt;
      var htmlWithRoyalty = NonExClusiveArt.NonExclusiveArtTxt.replace(/xxx/g, this.state.royalty);
      var htmlWithNonTransRoyalty = htmlWithRoyalty.replace(/yyy/g, this.state.nontransform);
      var htmlWithAddFree = htmlWithNonTransRoyalty.replace(/zzz/g, this.state.adfee);
      var htmlWithAdTimes = htmlWithAddFree.replace(/www/g, this.state.adtimes);
    }
    return (
      <Modal
        animationType="fade"
        transparent
        modalDidClose={onCloseRequest}
        onRequestClose={onCloseRequest}
        visible={status}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.wrapper}>
            <View style={styles.background}>
              <TouchableOpacity onPress={() => this.closeTerm()} style={styles.closeButton}>
                <Text style={styles.iconStyle}>X</Text>
              </TouchableOpacity>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Non-Exclusive Art License</Text>
              </View>
              {/* <TouchableOpacity style={styles.edit}>
            <CustomIcon name="edit2" size={METRICS.fontSizeBig} style={styles.icons} />
    </TouchableOpacity> */}
              {/* onPress={this.createPDF()} */}
              <TouchableOpacity
                onPress={() => this.createPDF(htmlWithAdTimes)}
                style={styles.download}
              >
                <CustomIcon name="download" size={METRICS.fontSizeBigger} style={styles.icons} />
              </TouchableOpacity>

              <KeyboardAwareScrollView style={{ height: 600 * METRICS.ratioY }}>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE READ THIS AGREEMENT AND HAVE BEEN ADVISED
                  BY US OF THE SIGNIFICANT IMPORTANCE OF RETAINING AN INDEPENDENT ATTORNEY OF YOUR
                  CHOICE TO REVIEW THIS AGREEMENT ON YOUR BEHALF. YOU ACKNOWLEDGE AND AGREE THAT YOU
                  HAVE HAD THE UNRESTRICTED OPPORTUNITY TO BE REPRESENTED BY AN INDEPENDENT
                  ATTORNEY. IN THE EVENT OF YOUR FAILURE TO OBTAIN AN INDEPENDENT ATTORNEY OR WAIVER
                  THEREOF, YOU HEREBY WARRANT AND REPRESENT THAT YOU WILL NOT ATTEMPT TO USE SUCH
                  FAILURE AND/OR WAIVER AS A BASIS TO AVOID ANY OBLIGATIONS UNDER THIS AGREEMENT, OR
                  TO INVALIDATE THIS AGREEMENT OR TO RENDER THIS AGREEMENT OR ANY PART THEREOF
                  UNENFORCEABLE.
                </Text>
                {craftData === '' ? (
                  <View>
                    <View style={[STYLES.horizontalAlign, styles.inputwrapper]}>
                      <Text style={[STYLES.textStyle, styles.maintext]}>Royalty %:</Text>
                      <TextInput
                        selectionColor={COLORS.primaryColor}
                        keyboardAppearance="dark"
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="off"
                        style={styles.textInput}
                        value={this.state.royalty}
                        onChangeText={(text) => this.setState({ royalty: text })}
                        maxLength={10}
                      />
                    </View>
                    <View style={[STYLES.horizontalAlign, styles.inputwrapper]}>
                      <Text style={[STYLES.textStyle, styles.maintext]}>
                        Non-Transformative Royalty %:
                      </Text>
                      <TextInput
                        selectionColor={COLORS.primaryColor}
                        keyboardAppearance="dark"
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="off"
                        style={styles.textInput}
                        value={this.state.nontransform}
                        onChangeText={(text) => this.setState({ nontransform: text })}
                        maxLength={7}
                      />
                    </View>

                    <View style={[STYLES.horizontalAlign, styles.inputwrapper]}>
                      <Text style={[STYLES.textStyle, styles.maintext]}>
                        Advertising Fee ($USD):
                      </Text>
                      <TextInput
                        selectionColor={COLORS.primaryColor}
                        keyboardAppearance="dark"
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="off"
                        style={styles.textInput}
                        value={this.state.adfee}
                        onChangeText={(text) => this.setState({ adfee: text })}
                        maxLength={10}
                      />
                    </View>

                    <View style={[STYLES.horizontalAlign, styles.inputwrapper]}>
                      <Text style={[STYLES.textStyle, styles.maintext]}>
                        Number of Ads Allowed:
                      </Text>
                      <TextInput
                        selectionColor={COLORS.primaryColor}
                        keyboardAppearance="dark"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="off"
                        style={styles.textInput}
                        value={this.state.adtimes}
                        onChangeText={(text) => this.setState({ adtimes: text })}
                        maxLength={15}
                      />
                    </View>
                  </View>
                ) : null}
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  This non-exclusive copyright license agreement (the “Agreement”), created on and
                  effective as of{' '}
                  <Text style={styles.inputs}>{this.state.date ? this.state.date : '[DATE]'}</Text>{' '}
                  (the “Effective Date”) is between{' '}
                  <Text style={styles.inputs}>
                    {craftData == '' ? '[SELLER]' : craftData.store_owner.name}
                  </Text>{' '}
                  (the “Licensor”) and{' '}
                  <Text style={styles.inputs}>
                    {userProfileData == '' ? '[BUYER]' : userProfileData.username}
                  </Text>{' '}
                  (the “Licensee”).
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  The Licensor hereby warrants that Licensor owns the copyright to the work to be
                  licensed (the “Art”) and/or has the necessary permissions to license the Art. The
                  Licensee wants to obtain, and the Licensor has agreed to grant, a license
                  authorizing the use of the Art in the preparation of one or more Collective Works
                  or Derivative Works for one or more of the purposes defined below.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  The parties therefore agree as follows:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>1. GRANT OF LICENSE.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. The Licensor hereby grants to Licensee a nonexclusive, nontransferable license
                  to exercise the following rights in the Art, in all media (including, but not
                  limited to, electronic, video, print, physical or virtual products, and any other
                  technology now known or that may be developed in the future):
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  i. to publish the Art, to reproduce the Art, to incorporate, include and/or use
                  the Art in the preparation of one or more Collective Works, and to reproduce the
                  Art as incorporated in the Collective Works. “Collective Works” means any work,
                  including prints, periodical issues, anthologies, electronic works, or video
                  compilations, in which the entire unmodified Art is assembled with other
                  contributions, each constituting separate and independent works in themselves,
                  into a collective whole;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  ii. to create and reproduce one or more Derivative Works. “Derivative Works” means
                  any work based on the Art, or on the Art and other preexisting works, including
                  motion picture versions, audiovisual works, art reproductions, condensations, new
                  video, digital or physical work incorporating the Art, or any other form in which
                  the Art may be recast, transformed, or adapted by the Licensee. A work
                  constituting a Collective Work is not considered a Derivative Work under this
                  agreement; and
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  iii. to distribute copies of, display, perform publicly, or use in any advertising
                  the Art, including as incorporated in Collective Works or Derivative Works.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>2. RESTRICTIONS.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. The license granted in section 1 above is subject to and limited by the
                  following restrictions:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  i. Limited Use. The permissions granted to the Licensee under this agreement apply
                  only to the uses and purposes stated and the Licensee may distribute, publicly
                  display, or use in any advertising the Art only under the terms of this agreement.
                  The Licensee may not sublicense the Art or transfer this license, without the
                  prior written consent of the Licensor. Any use that is inconsistent with the
                  limited license provided in this agreement will be a violation of the Licensor's
                  copyright and subject to copyright law. Should Licensee use the Art in a
                  Derivative Work or Collective Work that creates a work of joint authorship with
                  any third party, said third party must either also purchase a license from
                  Licensor or agree to be bound to this agreement as a licensee in writing with the
                  express permission of Licensor.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  ii. No Modification. The Licensee may not modify, copy, distribute, display,
                  reproduce, publish, license, create derivative works from, sublicense, or transfer
                  the Art obtained from the Licensor in any way not specifically granted in section
                  1 above without the prior written consent of the Licensor.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  iii. Right of Review. The Licensor may review any Collective Work or Derivative
                  Work before publication and if the Art exceeds 50% of its total content the
                  Licensor shall instead be entitled to receive a{' '}
                  <Text style={styles.inputs}>
                    {craftData == ''
                      ? this.state.nontransform
                      : craftData.craft_items[0].non_transformative_royalty}
                    %
                  </Text>{' '}
                  royalty and the work created by Licensee shall be considered a non-transformative
                  work.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  iv. Limitations on Transfer. The license hereby granted is not transferable, is
                  not exclusive, and applies only to the Art being licensed in this transaction.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  v. No Other Work. The Licensor grants no other right or license to the Licensee,
                  either express or implied, with respect to any other copyright or other
                  intellectual property right owned, possessed, or licensed by the Licensor.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  3. NO ASSIGNMENT OR TRANSFER.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. The rights granted to the Licensee by this agreement are license rights only
                  and nothing in this agreement constitutes an assignment or exclusive license of
                  the Licensor's rights in the Art. The Licensor retains ownership of the copyright
                  in the Art, and all rights not expressly granted in this agreement.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>4. CREDIT AND SAMPLES.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Credit. Acknowledgement of the original creator of the Art is automatically
                  conferred through the normal processes of the Craft Music mobile app when making a
                  derivative work. If Licensee wishes to use the work outside of the Craft Music
                  mobile app, Licensee should ask Licensor how Licensor should be credited, if at
                  all.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Copy of Work. On the Licensor’s request, the Licensee shall provide the
                  Licensor with a copy of each Collective Work and Derivative Work incorporating the
                  Art to allow the Licensor to confirm compliance with the grant of permission given
                  under this agreement. Derivative works are automatically tracked through the
                  normal processes of the Craft Music app; if you upload the work through another
                  process, or use the work outside of the app, you must provide Licensor with a copy
                  of work upon request.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. Copies of Advertisements. The Licensee will submit to the Licensor two copies
                  of any advertising material that will accompany distribution of the Art, or any
                  Collective Work or Derivative Work.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  d. Copy of Critical Work. If the Art will be reproduced in a Collective Work or
                  Derivative Work as a subject of criticism, a copy of the text addressing the Art
                  must accompany this agreement.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>5. FEES.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. License Issue Fee. On the effective date of this agreement (as described in
                  section 21 below), the Licensee shall pay to the Licensor a nonrefundable fee
                  which is currently listed for the work on the Craft Music app (the “License Issue
                  Fee”). The License Issue Fee is not an advance toward royalties that may become
                  due during any calendar quarter and the Licensee shall not deduct the amount of
                  the License Issue Fee from any royalties that may become due from the sale of a
                  Collective Work or Derivative Work.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Advertising Fee. The Licensee shall pay to the Licensor $
                  <Text style={styles.inputs}>
                    ${craftData == '' ? this.state.adfee : craftData.craft_items[0].adversting}
                  </Text>{' '}
                  for any non-transformative use of the Art or Collective Work within an
                  advertisement. This Advertising Fee allows the Licensee use of said Art or
                  Collective Work{' '}
                  <Text style={styles.inputs}>
                    {craftData == ''
                      ? this.state.adtimes
                      : craftData.craft_items[0].number_of_ads_allowed}
                  </Text>{' '}
                  times. Once Licensee has exceeded the permitted number of uses, a new Advertising
                  Fee must be paid for any further non-transformative use of the Art or any
                  Collective Work in an advertisement.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. Royalties. The Licensee shall pay to the Licensor, in addition to the License
                  Issue Fee, a continuing royalty of{' '}
                  <Text style={styles.inputs}>
                    {craftData == '' ? this.state.royalty : craftData.craft_items[0].royalty}%
                  </Text>{' '}
                  of Gross Sales of the price sold to the end users of any Collective Work, and/or
                  any Derivative Work incorporating any part of the Art sold by the Licensee or any
                  of its subsidiaries, divisions, agents, owners, or affiliates, even if sold by
                  third party distributors. If the Collective Work or Derivative Work is published,
                  displayed, used in monetized videos or other works, or otherwise used in
                  conjunction with advertising revenue, or revenue received from patronage, Licensor
                  shall instead receive{' '}
                  <Text style={styles.inputs}>
                    {craftData == '' ? this.state.royalty : craftData.craft_items[0].royalty}%
                  </Text>{' '}
                  of the gross revenue received by any person so exploiting the Collective work or
                  the Derivative Work (“Gross Revenue”). Any non-transformative use of the Art shall
                  have a{' '}
                  <Text style={styles.inputs}>
                    {craftData == ''
                      ? this.state.nontransform
                      : craftData.craft_items[0].non_transformative_royalty}
                    %
                  </Text>{' '}
                  royalty of the amount paid by the end user or any other amount generated by the
                  non-transformative use of the Art.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  d. Licensee hereby warrants that it will not create a Derivative Work or
                  Collective Work where the total royalties owed would be more than 100% of the
                  Gross Sales or Gross Revenue generated.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  e. If the Gross Sales plus Gross Revenue are equal to or greater than $80,000,
                  Licensee shall also pay to Craft Music a transaction fee royalty of 5% of Gross
                  Sales and Gross Revenue. “Gross Sales” means the Licensee's billing price to
                  customers or distributors, including the royalty amount less:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  i. customary trade discounts actually given;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>ii. returns; and</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  iii. transportation charges on returns.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  “Gross Revenue” means any monetary renumeration received by Licensee arising from
                  or related to the Derivative Work or Collective Work other than a sale of said
                  work.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  If the Licensee sells the Collective Work or any Derivative Work to any party
                  affiliated with the Licensee, or in any way related to or under common control
                  with the Licensee, at a price less than the regular price charged to other
                  parties, the royalties will be computed on the basis of the regular price charged
                  to other parties. No deduction from the royalties owed will be allowed for
                  uncollectible accounts, or for taxes, fees, assessments, advertising, or other
                  expenses of any kind that maybe incurred or paid by the Licensee, except as
                  specifically enumerated in the definition of Gross Sales. The Licensee shall
                  report and pay royalties quarterly. The royalty report deadline is 30 days after
                  the end of each calendar quarter.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>6. DELIVERY OF ART.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. The Licensor will provide a high-quality electronic version of the Art from
                  which the Licensee can use the Art solely for the purposes described in this
                  agreement. Delivery will occur via the Craft Music app, as soon as payment is
                  complete.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  7. OWNERSHIP AND USE OF ART.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Ownership of Art. The Licensee acknowledges that the Licensor is the owner of
                  the Art and of all associated federal registrations and pending registrations, and
                  the Licensee shall do nothing inconsistent with that ownership. The Licensee may
                  not claim ownership rights to the Art, or any derivative, compilation, sequel or
                  series, or related work owned or used by the Licensor. Nothing in this agreement
                  gives the Licensee any interest in the Art other than the right to use them in
                  accordance with this agreement.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Validity of Registrations. The Licensee admits the validity of all copyrights
                  for the Art and all associated registrations and acknowledges that all rights that
                  might be acquired to Art by the Licensee because of its use of the Art shall inure
                  to the sole benefit of the Licensor. The previous notwithstanding this subsection
                  does not entitle the Licensor to any of the revenues from the Licensee’s permitted
                  uses under this agreement, except for the fees described in section 5 above.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. Limitation on Licensee’s Actions. The Licensee may not do anything inconsistent
                  with the Licensor’s ownership of the Art, claim adversely to the Licensor, or
                  assist any third party in attempting to claim adversely to the Licensor, with
                  regards to that ownership. The Licensee may not challenge the Licensor's title to
                  the Art, oppose any registration or re-registrations of the Art, or challenge the
                  validity of this agreement or the grants provided under it. The Licensee may not
                  register the Art or any Collective Works or Derivative Works created from the Art,
                  as doing so would create conflicts with others who have non-exclusively licensed
                  the Art.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>8. REPRESENTATIONS.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  The Licensor hereby represents that:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. the Licensor is either the sole owner of all interest in the Art or otherwise
                  has such licenses and permissions as necessary to allow this transaction upon the
                  terms contained herein;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. the Art does not infringe on the intellectual property rights of any third
                  party, is not in the public domain, and does not contain anything that is illegal
                  or legally defined as “obscene” by U.S. law;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. the Licensor has not transferred, exclusively licensed, or encumbered the Art
                  or agreed to do so;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  d. the Licensor is not aware of any violation, infringement, or misappropriation
                  of any third party's rights or any claims of rights (including existing
                  intellectual property rights, rights of privacy, or any other rights) by the Art;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  e. the Licensor is not aware of any third-party consents, assignments, or licenses
                  that are necessary to meet its obligations under this agreement; and
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  f. the Licensor was not acting within the scope of employment of a third party
                  when conceiving, creating, or otherwise performing any activity with respect to
                  the Art purportedly licensed in section 1.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  The Licensee hereby warrants that it will take no action or series of actions or
                  inactions that would effect a circumvention of this Agreement or Licensor’s right
                  to renumeration as contemplated from this Agreement whether or not such actions
                  are or are not explicitly or implicitly restricted by this Agreement. It is the
                  express intent of both Parties that the Licensor receive{' '}
                  <Text style={styles.inputs}>
                    {craftData == '' ? this.state.royalty : craftData.craft_items[0].royalty}%
                  </Text>{' '}
                  of any gross proceeds generated by, arising from, or related to the Art.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  There is no intention by the Parties to create a joint work, and there is no
                  intention by the Licensor to grant any rights in and/or to any other derivative
                  works that may have been created by other third-party licensees.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>9. DOCUMENTATION.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Recordation of Agreement. The Licensor will, as soon as is reasonably possible
                  following a request from the Licensee, provide the Licensee with a complete copy
                  of all documentation (in any format) relating to the Art for the Licensee’s own
                  use, to meet record-keeping requirements of the Licensee, or to allow the Licensee
                  to exercise its rights granted under this agreement. The Licensor will also, on
                  request:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  i. execute any additional papers, including any separate licenses of the Art,
                  reasonably necessary to record the license in the United States and throughout the
                  world; and
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  ii. generally do all other lawful acts reasonable and necessary to record the
                  agreement in the United States and throughout the world.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Licensee Assistance in Maintaining Work. The Licensee shall on request give to
                  the Licensor or its authorized representatives any information as to its use of
                  the Art, any Collective Work, or any Derivative Work that the Licensor may
                  reasonably require and will render any (nonmonetary) assistance reasonably
                  required by the Licensor in maintaining the Art or any registrations of the Art.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>10. INDEMNIFICATION.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  If the Art infringes on any United States copyright of a third party not
                  affiliated with the Licensee, the Licensor shall indemnify the Licensee against
                  that claim if all of the following are true:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. the Licensee promptly notifies the Licensor of that claim;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. the Licensor controls the defense and settlement of that claim;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. the Licensee fully cooperates with the Licensor in connection with its defense
                  and settlement of that claim;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  d. the Licensee stops all sales, distribution, and public use of or relating to
                  the infringing Art, including as necessary any Collective Works or Derivative
                  Works, if requested by the Licensor.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  If the Licensee is enjoined from further use of any infringing Art or if the
                  Licensee stops using any of the Art (including as necessary any Collective Works
                  or Derivative Works) because of the Licensor's request (as described in (d)
                  above), the Licensor shall, at its own expense and option:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. obtain the right for the Licensee to continue to use the infringing Art;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. modify the infringing Art to eliminate that infringement (if practicable); or
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. refund the amount paid under this agreement for the infringing Art to the
                  Licensee, on such terms as the parties may agree.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  d. reimburse Licensee for any costs or damages directly attributable to the Art
                  infringing third party intellectual property that is assessed by a court of
                  competent jurisdiction in the United State of America.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  The Licensor shall have no other obligations or liability if infringement occurs
                  and shall have no other obligation of indemnification relating to infringement.
                  The Licensor shall not be liable for any costs or expenses incurred without its
                  prior written authorization and shall have no obligation of indemnification or any
                  liability if the infringement is based on:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. any changed form of the Art not made by the Licensor; or
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. the laws of any country other than the United States of America or its states.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>11. TERMINATION.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Term: The Term of this Agreement as it applies to Collective Works or
                  Derivative works Published by the Licensee shall last so long as Licensee has
                  fully complied with the terms of this Agreement and the Art has not entered the
                  public domain. The Licensee shall only have the ability to create new Collective
                  Works or Derivative Works based on the Art during a 5-year period ending on the
                  5-year anniversary of the Effective Date.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. The agreement will terminate immediately, without notice, if:
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  i. before publication, the Licensee has not complied with this agreement;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  ii. the Licensee attempts to transfer any of the rights granted to the Licensee in
                  connection with this agreement without obtaining the Licensor's prior written
                  consent;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  iii. the Licensee uses the Art in a manner not expressly permitted by this
                  agreement;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  iv. no Collective Work, Derivative Work, or reproduction of Art is published
                  within one year of the effective date of this agreement, unless extended by
                  written permission of the Licensor;
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  v. the copyright and acknowledgment notices are not printed as specified in
                  section 4; or
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  vi. a Collective Work, Derivative Work, or reproduction of Art is published and
                  remains out of print for a period of at least six months after the 4-year
                  anniversary of the Effective Date.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. The Agreement will terminate with 15 days prior notice being sent to the
                  Licensee, in the event that any payment due under this agreement is not paid when
                  due. The licensee shall have the right to cure said breach within the 10-day
                  notice period. During any good faith disagreement on amounts due, the Licensor may
                  request that a certified accountant review the books and records of Licensee to
                  ensure compliance with this Agreement. If such an accountant shall determine that
                  the books of Licensee were not sufficiently kept for said accountant to make an
                  accurate determination, that licensee was unhelpful in the conduct of the audit,
                  or that any amount remains owed and outstanding from Licensee to Licensor,
                  Licensor shall have and additional 10 days to cure, or this Agreement shall be
                  terminated.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  d. Effect of Termination. All rights granted by this agreement, including the
                  Licensee's right to use the Art, shall end on termination of this agreement. On
                  termination of this agreement, the Licensee shall promptly discontinue all use of
                  Art, any Collective Work, or any Derivative Work, and refrain from further
                  reproduction, publishing, performance or distributing of the Collective Work or
                  Derivative Work. However, the Licensee may fill existing orders and sell off
                  existing copies of Collective Works or Derivative Works then in stock if the
                  sell-off period is no more than three months from the date of termination. Any
                  sales of Collective Works or Derivative Works during this wind down period will
                  constitute Gross Sales and the above royalties must be paid on said sales. If the
                  Licensee is in arrears on payments owed to Licensor, the entire proceeds of said
                  sales shall be paid to Licensor until all amounts owed are fully satisfied. The
                  Licensor shall have the right to verify the existence and validity of the existing
                  orders and existing copies of the Collective Work or Derivative Work then in stock
                  on reasonable notice to the Licensee.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  e. Licensee agrees that a breach or threatened breach of this Agreement by
                  Licensee give rise to irreparable injury to Licensor, which may not be adequately
                  compensated by damages. Accordingly, in the event of a breach or threatened breach
                  by the Licensee of the provisions of this Agreement, Licensor may seek and shall
                  be entitled to a temporary restraining order and a preliminary injunction
                  restraining the Licensee from violating the provisions of this Agreement. Nothing
                  herein shall prohibit Licensor from pursuing any other available legal or
                  equitable remedy from such breach or threatened breach, including but not limited
                  to the recovery of damages from the Licensee. The Licensee shall be responsible
                  for all costs, expenses or damages that Licensor incurs as a result of any
                  violation by the Licensee of any provision of this Agreement. Licensee’ obligation
                  shall include court costs, litigation expenses, and reasonable attorneys' fees.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>12. GOVERNING LAW.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Choice of Law. The laws of the jurisdiction in which the Licensor resides at
                  the time of sale govern this agreement (without giving effect to its conflicts of
                  law principles but giving full effect to any and all applicable international
                  treaties made between Licensor and Licensee’s countries of residence).
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Choice of Forum. Both parties consent to the personal jurisdiction of the state
                  and federal courts in the Licensor’s county and state or foreign equivalent
                  jurisdiction.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. The parties hereby agree that the decision made by such courts shall be
                  considered arbitral awards for the purpose of foreign enforcement of said awards
                  as if said adjudicator was appointed as the arbitrator, and the laws and
                  government of said jurisdiction the as the arbitral institution. If any country
                  refuses to enforce such a judgement as an arbitral award, the parties do hereby
                  authorize the judgment to be sent to an Arbitrator in Atlanta, Georgia under the
                  auspices of the American Arbitration Association, said arbitrator having solely
                  the power and authority to produce an award identical to the judgement created by
                  the adjudicating court in the Licensor’s place of residence at the time of sale,
                  the costs of which shall be borne by the losing party of the original action.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>13. AMENDMENTS.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  No amendment to this agreement will be effective unless it is in writing and
                  signed by a party or its authorized representative.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  14. ASSIGNMENT AND DELEGATION.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. No Assignment. Neither party may assign any of its rights under this agreement,
                  except with the prior written consent of the other party. All voluntary
                  assignments of rights are limited by this subsection. The previous
                  notwithstanding, the Licensor may assign its right to receive payments to a
                  third-party, however the Licensee may continue to make payments to the either the
                  third party or Licensor and it is the Licensor’s sole responsibility to ensure
                  that the assignee receives payments sent to Licensor.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. No Delegation. Neither party may delegate any performance under this agreement,
                  except with the prior written consent of the other party.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. Enforceability of an Assignment or Delegation. If a purported assignment or
                  purported delegation is made in violation of this section, it is void.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  15. COUNTERPARTS; ELECTRONIC SIGNATURES.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Counterparts. The parties may execute this agreement in any number of
                  counterparts, each of which is an original but all of which constitute one and the
                  same instrument.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Electronic Signatures. This agreement, agreements ancillary to this agreement,
                  and related documents entered into in connection with this agreement are signed
                  when a party's signature is delivered by facsimile, email, or other electronic
                  medium, including tapping or clicking any button that constitutes an offer or
                  acceptance of the offer on the Craft Music App or Website. These signatures must
                  be treated in all respects as having the same force and effect as original
                  signatures. If any governing authority requires handwritten signatures to
                  effectuate the intent of this Agreement, the Parties agree to take such actions as
                  are necessary to rectify any such requirements and to take such other actions as
                  necessary to put the other Party in the position that they would be in had the
                  execution of this agreement complied with local rules of contractual viability
                  from the Effective Date.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>16. SEVERABILITY.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  If any one or more of the provisions contained in this agreement is, for any
                  reason, held to be invalid, illegal, or unenforceable in any respect, that
                  invalidity, illegality, or unenforceability will not affect any other provisions
                  of this agreement, but this agreement will be construed as if those invalid,
                  illegal, or unenforceable provisions had never been contained in it, unless the
                  deletion of those provisions would result in such a material change so as to cause
                  completion of the transactions contemplated by this agreement to be unreasonable.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>17. NOTICES.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  a. Writing; Permitted Delivery Methods. Each party giving or making any notice,
                  request, demand, or other communication required or permitted by this agreement
                  shall give that notice in writing and use one of the following types of delivery,
                  each of which is a writing for purposes of this agreement: personal delivery, mail
                  (registered or certified mail, postage prepaid, return-receipt requested),
                  nationally recognized overnight courier (fees prepaid), facsimile, direct message,
                  email, or other written electronic communication.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  b. Addresses. If submitting notice by mail or courier, a party shall address
                  notices under this section to another party at the address provided by the other
                  party.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  c. Effectiveness. A notice is effective only if the party giving notice complies
                  with subsections (a) and (b) and if the recipient receives the notice, whether it
                  is opened or unopened.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>18. WAIVER.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  No waiver of a breach, failure of any condition, or any right or remedy contained
                  in or granted by the provisions of this agreement will be effective unless it is
                  in writing and signed by the party waiving the breach, failure, right, or remedy.
                  No waiver of any breach, failure, right, or remedy will be deemed a waiver of any
                  other breach, failure, right, or remedy, whether or not similar, and no waiver
                  will constitute a continuing waiver, unless the writing so specifies.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>19. ENTIRE AGREEMENT.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  This agreement constitutes the final agreement of the parties. It is the complete
                  and exclusive expression of the parties’ agreement about the subject matter of
                  this agreement. All prior and contemporaneous communications, negotiations, and
                  agreements between the parties relating to the subject matter of this agreement
                  are expressly merged into and superseded by this agreement. The provisions of this
                  agreement may not be explained, supplemented, or qualified by evidence of trade
                  usage or a prior course of dealings. Neither party was induced to enter this
                  agreement by, and neither party is relying on, any statement, representation,
                  warranty, or agreement of the other party except those set forth expressly in this
                  agreement. Except as set forth expressly in this agreement, there are no
                  conditions precedent to this agreement’s effectiveness.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>20. HEADINGS.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  The descriptive headings of the sections and subsections of this agreement are for
                  convenience only, and do not affect this agreement's construction or
                  interpretation.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>21. EFFECTIVENESS.</Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  This agreement will become effective once purchase and sale is made between the
                  parties via the Craft Music mobile app. The date of purchase will be deemed the
                  date of this agreement.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  22. NECESSARY ACTS; FURTHER ASSURANCES.
                </Text>
                <Text style={[STYLES.textStyle, styles.maintext]}>
                  Each party shall use all reasonable efforts to take, or cause to be taken, all
                  actions necessary or desirable to consummate and make effective the transactions
                  this agreement contemplates or to evidence or carry out the intent and purposes of
                  this agreement.
                </Text>
              </KeyboardAwareScrollView>
              {craftData == '' ? null : (
                <TouchableOpacity
                  onPress={() => this.onCheckTerm()}
                  style={[STYLES.textStyle, styles.agreeButton]}
                >
                  <Button
                    style={styles.button}
                    title="Agree"
                    fontSize={METRICS.fontSizeNormal}
                    status={3}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  background: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    position: 'relative',
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  maintext: {
    fontSize: METRICS.fontSizeNormal,
    paddingHorizontal: METRICS.spacingNormal,
    paddingVertical: METRICS.spacingNormal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    color: COLORS.lightGrey,
    fontFamily: 'lato',
  },
  inputs: {
    fontSize: METRICS.fontSizeNormal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    color: COLORS.primaryColor,
    fontFamily: 'Lato-Semibold',
  },
  titleWrapper: {
    marginBottom: METRICS.spacingNormal,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  closeButton: {
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginBig,
    position: 'absolute',
    top: -15,
    left: -20,
    zIndex: 100,
  },
  edit: {
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginBig,
    position: 'absolute',
    top: -15,
    right: 30,
    zIndex: 100,
  },
  download: {
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginBig,
    position: 'absolute',
    top: -15,
    right: -20,
    zIndex: 100,
  },
  iconStyle: {
    marginLeft: METRICS.marginSmall,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
    paddingLeft: METRICS.spacingTiny,
    paddingTop: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
  },
  icons: {
    marginLeft: METRICS.marginSmall,
    color: COLORS.whiteColor,
    fontFamily: 'Lato-Bold',
    paddingLeft: METRICS.spacingTiny,
    paddingTop: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
  },
  textInput: {
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
    padding: METRICS.spacingTiny,
    minHeight: METRICS.rowHeightSmall,
    color: COLORS.whiteColor,
    minWidth: 80 * METRICS.ratioX,
    textAlign: 'center',
  },
  inputwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: METRICS.spacingNormal,
  },
  button: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
  agreeButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: METRICS.marginSmall,
  },
});

LicenseArtLease.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

LicenseArtLease.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default LicenseArtLease;
