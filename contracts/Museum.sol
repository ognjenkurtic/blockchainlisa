pragma solidity ^0.4.17;

contract Museum {

    enum ArtworkState {AtOwner, Offered, Lended }

    struct Artwork {
        address owner;
        address holder;
        ArtworkState state;
    }

    Artwork[] artworks;

    function initCollection() public returns (uint ) {

        if(artworks.length > 0) {
            return 0;
        }

        artworks.push(Artwork({
            owner: msg.sender,
            holder: 0x0,
            state: ArtworkState.AtOwner
        }));

        artworks.push(Artwork({
            owner: msg.sender,
            holder: 0x0,
            state: ArtworkState.AtOwner
        }));

        artworks.push(Artwork({
            owner: msg.sender,
            holder: 0x0,
            state: ArtworkState.AtOwner
        }));

        artworks.push(Artwork({
            owner: msg.sender,
            holder: 0x0,
            state: ArtworkState.AtOwner
        }));
        

        return 0;
    }

    function lend(uint artworkId, address holder) public returns (uint) {
        address owner = artworks[artworkId].owner;
        require(msg.sender == owner);

        artworks[artworkId].holder = holder;
        artworks[artworkId].state = ArtworkState.Offered;

        return 0;
    }

    function accept(uint artworkId) public returns (uint) {
        address holder = artworks[artworkId].holder;
        require(msg.sender == holder);

        artworks[artworkId].state = ArtworkState.Lended;

        return 0;
    }

    function getArtworkDetails(uint artworkId) public view returns (address, ArtworkState, address){
        return (artworks[artworkId].owner, artworks[artworkId].state, artworks[artworkId].holder);
    }
}
