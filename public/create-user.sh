#!/usr/bin/env bash
# as root
# curl -fsSL https://bigconfig.it/create-user.sh | bash
set -eu

__wrap__() {
    USERNAME="${USERNAME:-vscode}"
    USERID="${USERID:-1000}"
    GITHUB_USER="${GITHUB_USER:-amiorin}"
    SSH_KEY=$(curl -fsSL https://github.com/${GITHUB_USER}.keys)

    # Create the user
    if ! id $USERNAME &>/dev/null; then
        echo "Creating user '${USERNAME}'"
        useradd -m -u $USERID -s /bin/bash $USERNAME
    fi

    # Create .ssh directory
    mkdir -p /home/$USERNAME/.ssh
    chmod 700 /home/$USERNAME/.ssh

    # Add the SSH public key to authorized_keys
    LINE=$SSH_KEY
    FILE=/home/$USERNAME/.ssh/authorized_keys
    if ! grep -Fxq "$LINE" "$FILE"; then
        echo "Updating '${FILE}'"
        echo "$LINE" | tee -a "$FILE"
    fi

    chmod 600 /home/$USERNAME/.ssh/authorized_keys

    # Set proper ownership
    chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh

    # vscode passwordless sudo
    FILE=/etc/sudoers.d/$USERNAME
    echo "(Re)creating '${FILE}'"
    echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" | tee "$FILE"
    chmod 440 "$FILE"
} && __wrap__
