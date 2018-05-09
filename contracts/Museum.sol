pragma solidity ^0.4.17;

contract Museum {

    enum ArtworkState {AtOwner, Offered, Lended }

    struct Artwork {
        address owner;
        address lender;
        ArtworkState state;
    }

    Artwork[] artworks;

    function initCollection() public returns (uint ) {

        artworks.push(Artwork({
            owner: msg.sender,
            lender: 0x0,
            state: ArtworkState.AtOwner
        }));

        artworks.push(Artwork({
            owner: msg.sender,
            lender: 0x0,
            state: ArtworkState.AtOwner
        }));

        artworks.push(Artwork({
            owner: msg.sender,
            lender: 0x0,
            state: ArtworkState.AtOwner
        }));

        artworks.push(Artwork({
            owner: msg.sender,
            lender: 0x0,
            state: ArtworkState.AtOwner
        }));
        

        return 0;
    }

    function lend(uint artworkId, address lender) public returns (uint) {
        // // address owner = artworks[artworkId].owner;
        // // require(msg.sender == owner);

        artworks.push(Artwork({
            owner: msg.sender,
            lender: lender,
            state: ArtworkState.Offered
        }));

        artworks[artworkId].lender = lender;
        artworks[artworkId].state = ArtworkState.Offered;

        return 0;
    }

    function getAllArtworks() public view returns (address, address){
        return (artworks[3].owner, artworks[3].lender);
    }
}
